from posixpath import splitext
from celery import shared_task
from celery_progress.backend import ProgressRecorder
import requests, youtube_dl, re, subprocess, os, string, re
import time, shutil, io
import time
from subprocess import PIPE
from youtube_comment_downloader import downloader
from django.core.files import File
from django.core.files.storage import FileSystemStorage
import json
from albumsplit.settings import BASE_DIR, SCRIPTS_DIR, MEDIA_ROOT
from pathlib import Path


@shared_task(bind=True)
def get_album_info(self, url):
    print('task started')
    progress_recorder = ProgressRecorder(self)
    num_tasks = 4
    progress_recorder.set_progress(1, num_tasks, description=f'looking in description for timecodes')
    print('start')
    ydl_opts = {
        'outtmpl': 'media/%(id)s.%(ext)s',
        'extractaudio': True,
        'format': 'bestaudio/best',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
        }]
    }
    with youtube_dl.YoutubeDL(ydl_opts) as ydl:
        message = ydl.extract_info(url, download=False)
    titleid = message["id"]
    year = message["upload_date"][:4]
    title = message["title"]
    artist = message["uploader"]
    description = message['description']
    playlist = get_timecodes(description.splitlines())
    comment_playlists = []
    if not playlist:
        progress_recorder.set_progress(2, num_tasks, description=f'looking in comments for timecodes')
        message = downloader.main(['--youtubeid', titleid, '--output', 'thing', '--sort', '0', '--limit', '50'])
        for comment in message:
            comment_playlists.append(get_timecodes(comment))
        timecodes = comment_playlists
    else:
        timecodes = [playlist]
    progress_recorder.set_progress(3, num_tasks, description=f'done')
    return {
        'title': title,
        'artist': artist,
        'year': year,
        'timecodes': timecodes,
        'titleid': titleid
    }

@shared_task(bind=True)
def download(self, info):
    clean_up()
    progress_recorder = ProgressRecorder(self)
    num_tasks = 10
    progress_recorder.set_progress(0, num_tasks, description=f'Downloading (0%)')
    booksplit_path = os.path.join(SCRIPTS_DIR, 'booksplit')
    esctitle_path = os.path.join(SCRIPTS_DIR, 'esctitle')
    tag_path = os.path.join(SCRIPTS_DIR, 'tag')
    url, titleid, timecodes, title, artist, year, split = \
    info['url'], info['titleid'], info['timecodes'], \
    info['title'], info['artist'], info['year'], info['split']


    if not exists_already(titleid):
        def get_percentage(d):
            if d['status'] == 'finished':
                progress_recorder.set_progress(8, num_tasks, description='Downloading (100%)')
                return '100%'
            if d['status'] == 'downloading':
                percentage_progress = d['_percent_str']
                percent = percentage_progress.strip().strip('%')
                # get overall progress from download progress, 
                # assuming download takes 6/10 of the progress bar
                overall_percentage = (float(percent) * .01) * .8 * num_tasks
                progress_recorder.set_progress(overall_percentage, num_tasks, 
                    description=f'Downloading ({percentage_progress.strip()})')

        ydl_opts = {
            'outtmpl': 'media/%(id)s.%(ext)s',
            'extractaudio': True,
            'audio-quality': 'bestaudio/best',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
            }],
            'progress_hooks': [get_percentage]
        }

        with youtube_dl.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
        if split:
            with open(f'media/{titleid}.txt', "w+") as f:
                f.write(timecodes + '\n')

    tagurl = FileSystemStorage().url(f'{titleid}.txt')
    tagfile = f'{titleid}.txt'
    mediaurl = FileSystemStorage().url(f'{titleid}.m4a')
    mediafile = f'{titleid}.m4a'
    if not Path('.' + mediaurl).is_file():
        mediaurl = FileSystemStorage().url(f'{titleid}.opus')
        mediafile = f'{titleid}.opus'
    escapedtitle = subprocess.Popen([esctitle_path, f'{title}'], stdout=PIPE) \
        .stdout.read().decode("utf-8").split('\n')[0]
    # if splitting, serve zipped foler
    # else, serve zipped file (either being called escapedtitle) 
    messages = []
    os.chdir(MEDIA_ROOT)

    if split:
        progress_recorder.set_progress(6, num_tasks, 
            description=f'splitting audio & tagging tracks')
        split_process = subprocess.Popen([
            booksplit_path, 
            f'{mediafile}', 
            f'{tagfile}', 
            f'{title}', 
            f'{artist}', 
            f'{year}'], stdout=PIPE, stderr=PIPE)
        messages.append(split_process.stdout.read().decode("utf-8").rstrip().split('\n'))
        messages.append(split_process.stderr.read().decode("utf-8").rstrip())
        progress_recorder.set_progress(8, num_tasks, description=f'Compressing result')
        compress_process = subprocess.Popen([
            'zip', '-r', f'{escapedtitle}.zip', f'{escapedtitle}'
            ], stdout=PIPE, stderr=PIPE)
        messages.append(compress_process.stdout.read().decode("utf-8").rstrip())
        messages.append(compress_process.stderr.read().decode("utf-8").rstrip())
        zipurl = FileSystemStorage().url(f'{escapedtitle}.zip')
    
    else: # if just serving the single opus or m4a file
        ext = os.path.splitext(mediaurl)[1]
        os.rename(f'..{mediaurl}', escapedtitle + ext)
        zipurl = FileSystemStorage().url(escapedtitle + ext)
    progress_recorder.set_progress(10, num_tasks, description='Finished')

    return {
        'zipurl': zipurl,
        'longmediaurl': mediaurl,
        'tagurl': tagurl,
        'messages': messages
    }


def get_timecodes(text):
    playlist = []
    for line in text:
        if re.search(r'[0-9]{1,2}(:[0-9]{1,2}){1,3}', line):
            if re.search(r'[a-zA-Z].*[a-zA-Z]', line):
                time = re.search(r'[0-9]{1,2}(:[0-9]{1,2}){1,3}', line).group()
                song = re.search(r'[a-zA-Z].*[a-zA-Z]', line).group()
                sequence = [time, song]
                playlist.append(sequence)
    return playlist

def exists_already(id):
    for file in os.listdir(MEDIA_ROOT):
        if id in file:
            print(f'found file {file} matching id {id}')
            return True
    print(f'didn\'t find a video file matching the id {id}')
    return False

def clean_up():
    # remove all but the 20 most recently modified
    # files in the directory
    os.chdir(MEDIA_ROOT)
    files = os.listdir()
    if len(files) < 20:
        return
    files.sort(key=lambda x: os.stat(x).st_mtime)
    for file in files[20:]:
        if os.path.isfile(file):
            os.remove(file)
        if os.path.isdir(file):
            shutil.rmtree(file)
    os.chdir(BASE_DIR)