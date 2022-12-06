from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from feed import views

app_name = "feed"

urlpatterns = [
    path('api/feed', views.FeedListAPI.as_view()),
    path('api/feed/post', views.PostFeedAPI.as_view()),
    path('api/<username>/feed/<int:pk>', views.GetFeedAPI.as_view()),
    path('home', views.FeedView.get, name='home'),
    path('explore', views.FeedView.get, name='explore'),
    path('notifications', views.FeedView.get, name='notifications'),
    path('messages', views.FeedView.get, name='messages'),
    path('questions', views.FeedView.get, name='questions'),
    path('rooms', views.FeedView.get, name='rooms'),
    path('feed/compose/', views.FeedView.compose, name='compose'),
    path('feed/post/', views.FeedView.post, name='post'),
    path('search', views.FeedView.get, name='search'),
    path('<username>/feed/<int:pk>/', views.FeedView.view, name='view'),
    path('feed/like/<int:pk>/', views.FeedView.like, name='like'),
    path('feed/poll/vote/', views.FeedView.vote, name='vote'),
    path('feed/menu/<int:pk>/', views.FeedView.menu, name='menu'),
    path('feed/edit/', views.FeedView.update, name='edit'),
    path('feed/delete/', views.FeedView.delete, name='delete'),
    path('feed/more/', views.FeedView.more, name='more'),
    path('feed/comment/', views.CommentView.post, name='comment'),
]