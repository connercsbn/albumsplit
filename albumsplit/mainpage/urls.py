from django.urls import path
from . import views

urlpatterns = [
    path('yturl', views.yturl, name='yturl'),
    path('album_data/<str:task_id>', views.album_data, name='album_data'),
    path('get_album/', views.get_album, name='get_album')
]