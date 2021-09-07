from django.shortcuts import render
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.http import StreamingHttpResponse
from django.views.generic import TemplateView
from django.core.files import File
from django.core.files.storage import FileSystemStorage
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie

from rest_framework import viewsets
from celery.result import AsyncResult
from subprocess import PIPE
import json
from mainpage.tasks import get_album_info, download

@require_http_methods(["POST"])
@ensure_csrf_cookie
def yturl(request):
    url = json.loads(request.body.decode("utf-8"))['url']
    download_task = get_album_info.delay(url)
    task_id = download_task.task_id
    return JsonResponse({
        'id': task_id
    })

@require_http_methods(["POST"])
@ensure_csrf_cookie
def get_album(request):
    data = json.loads(request.body.decode("utf-8"))
    download_task = download.delay(data)
    task_id = download_task.task_id
    return JsonResponse({
        'id': task_id
    })

def csrf(request):
    return JsonResponse({'csrfToken': get_token(request)})
