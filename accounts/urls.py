from django.urls import path
from . import views

app_name = "accounts"

urlpatterns = [
    path('<username>', views.ProfileView.get, name='profile'),
    path('<username>/feeds/', views.ProfileView.feeds, name='feeds'),
    path('<username>/with_replies/', views.ProfileView.with_replies, name='with_replies'),
    path('<username>/media/', views.ProfileView.media, name='media'),
   path('<username>/likes/', views.ProfileView.likes, name='likes'),
    path('<username>/followers/', views.followers, name='followers'),
    path('<username>/following/', views.following, name='following'),
    path('accounts/follow/<str:user>/', views.follow, name='follow'),
    path('accounts/settings/', views.settings, name='settings'),
]