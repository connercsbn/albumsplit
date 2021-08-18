from celery import shared_task
from celery_progress.backend import ProgressRecorder
import requests, youtube_dl, re, subprocess, os, string, re
import time, shutil, io
import time
from subprocess import PIPE
from youtube_comment_downloader import downloader
from django.core.files import File
from django.core.files.storage import FileSystemStorage
import shlex
from albumsplit.settings import BASE_DIR, SCRIPTS_DIR, MEDIA_ROOT



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
    playlist = get_timecodes(description.splitlines()[1:])
    print(playlist)
    if not playlist:
        progress_recorder.set_progress(2, num_tasks, description=f'looking in comments for timecodes')
        message = downloader.main(['--youtubeid', titleid, '--output', 'thing'])
        playlist = get_timecodes(message.splitlines())
        print(playlist)
    progress_recorder.set_progress(3, num_tasks, description=f'done')
    return {
        'title': title,
        'artist': artist,
        'year': year,
        'timecodes': playlist,
        'titleid': titleid
    }

@shared_task(bind=True)
def download(self, info):
    progress_recorder = ProgressRecorder(self)
    num_tasks = 4
    progress_recorder.set_progress(1, num_tasks, description=f'downloading video')
    booksplit_path = os.path.join(SCRIPTS_DIR, 'booksplit')
    esctitle_path = os.path.join(SCRIPTS_DIR, 'esctitle')
    tag_path = os.path.join(SCRIPTS_DIR, 'tag')
    url, titleid, timecodes, title, artist, year =\
    info['url'], info['titleid'], info['timecodes'], \
    info['title'], info['artist'], info['year']


    if not exists_already(titleid):
        def get_percentage(d):
            if d['status'] == 'finished':
                progress_recorder.set_progress(2, num_tasks, description='100%')
                return '100%'
            if d['status'] == 'downloading':
                percentage_progress = d['_percent_str'].trim()
                progress_recorder.set_progress(2, num_tasks, description=f'Downloading ({percentage_progress}%)')

        progress_recorder.set_progress(2, num_tasks, description='still goin')

        ydl_opts = {
            'outtmpl': 'media/%(id)s.%(ext)s',
            'extractaudio': True,
            'format': 'bestaudio/best',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
            }],
            'progress_hooks': [get_percentage]
        }

        with youtube_dl.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
        with open(f'media/{titleid}.txt', "w+") as FILE:
            FILE.write('\n'.join([' '.join(timecode) for timecode in timecodes]))

    tagurl = FileSystemStorage().url(f'{titleid}.txt')
    longmediaurl = FileSystemStorage().url(f'{titleid}.opus')
    escapedtitle = subprocess.Popen([esctitle_path, f'{title}'], stdout=PIPE) \
        .stdout.read().decode("utf-8").split('\n')[0]
    progress_recorder.set_progress(2, num_tasks, 
        description=f'splitting audio & tagging tracks')
    process1 = subprocess.Popen([
        booksplit_path, 
        f'.{longmediaurl}', 
        f'.{tagurl}', 
        f'{title}', 
        f'{artist}', 
        f'{year}'], stdout=PIPE, stderr=PIPE)
    messages = []
    messages.append(process1.stdout.read().decode("utf-8").rstrip().split('\n'))
    messages.append(process1.stderr.read().decode("utf-8").rstrip())
    os.chdir(MEDIA_ROOT)
    progress_recorder.set_progress(3, num_tasks, description=f'compressing folder')
    process2 = subprocess.Popen([
        'zip', '-r', f'{escapedtitle}.zip', f'{escapedtitle}'
        ], stdout=PIPE, stderr=PIPE)
    os.chdir(BASE_DIR)
    messages.append(process2.stdout.read().decode("utf-8").rstrip())
    messages.append(process2.stderr.read().decode("utf-8").rstrip())
    zipurl = FileSystemStorage().url(f'{escapedtitle}.zip')
    progress_recorder.set_progress(4, num_tasks, description=f'done')
    return {
        'zipurl': zipurl,
        'longmediaurl': longmediaurl,
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
    for file in os.listdir('media'):
        if id in file:
            print(f'found file {file} matching id {id}')
            return True
    print(f'didn\'t a video file matching the id {id}')
    return False

def clean_up():
    for file in os.listdir('media'):
        file = (f"media/{file}")
        print(file)
        if time.time()-os.stat(file).st_mtime > 300:
            if os.path.isfile(file):
                os.remove(file)
            if os.path.isdir(file):
                shutil.rmtree(file)