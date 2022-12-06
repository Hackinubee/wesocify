from django.urls import path
from . import views

app_name = "core"

urlpatterns = [
    path('welcome', views.welcome, name='welcome'),
    path('register', views.register, name='register'),
    path('terms', views.terms, name='terms'),
    path('privacy', views.privacy_policy, name='privacy'),
    path('logout', views.logout, name='logout'),
]