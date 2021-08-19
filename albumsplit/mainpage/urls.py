from django.urls import path
from . import views

urlpatterns = [
    path('yturl', views.yturl, name='yturl'),
    path('get_album/', views.get_album, name='get_album'),
    path('csrf/', views.csrf),
]