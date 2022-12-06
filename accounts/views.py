from django.shortcuts import render, redirect
from django.urls import reverse
from django.contrib.auth.models import User, auth
from django.contrib import messages
from django.conf import settings
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.decorators import login_required
from .models import *
from feed.models import *
from feed.utils import get_user_followers
from .utils import *

class ProfileView():
    @login_required
    def get(request, username):
        try:
            user_object = User.objects.get(username=username)
            user_posts = Feed.objects.filter(username=username)
            user_post_length = user_posts.count()
            user_followers = user_object.followers.all
            user_following = user_object.following.all
            context = {
                'page_title': f'{user_object.name} @({user_object.username})',
                'user': user_object,
                'user_posts': user_posts,
                'user_post_count': user_post_length,
                'user_followers': user_followers,
                'user_following': user_following,
            }
            return render(request, 'profile/content.html', context)
        except User.DoesNotExist:
               return render(request, 'errors/404.html')

    @login_required
    def feeds(request, username):
      try:
        user_obj = User.objects.get(username=username)
        feed_obj = Feed.objects.filter(user__username=username).order_by('-created_at')
        context = {
          'feeds': feed_obj,
          'user': user_obj
        }
        return render(request, 'profile/feeds/content.html', context)
      except User.DoesNotExist:
        return HttpResponse("Not Found", status=404)
    
    @login_required
    def with_replies(request, username):
      """ Feeds User Created With Replies """
      try:
        user_obj = User.objects.get(username=username)
        feed_obj = Feed.objects.filter(user__username=username, comments__username=username).order_by('-created_at')
        context = {
          'feeds': feed_obj,
          'user': user_obj
        }
        return render(request, 'profile/feeds/with_replies.html', context)
      except User.DoesNotExist:
        return HttpResponse("Not Found", status=404)

    @login_required
    def media(request, username):
      """ Feeds User Created With Media """
      try:
        user_obj = User.objects.get(username=username)
        feed_obj = Feed.objects.filter(user__username=username).order_by('-created_at')
        feeds = []
        for feed in feed_obj:
          if feed.images.all().count() > 0:
            feeds.append(feed)
        context = {
          'feeds': feeds,
          'user': user_obj
        }
        return render(request, 'profile/feeds/media.html', context)
      except User.DoesNotExist:
        return HttpResponse("Not Found", status=404)

    @login_required
    def likes(request, username):
      """ Feeds User Liked """
      try:
        user_obj = User.objects.get(username=username)
        feed_obj = Feed.objects.filter(likes__username=username).order_by('-created_at')
        context = {
          'feeds': feed_obj,
          'user': user_obj
        }
        return render(request, 'profile/feeds/likes.html', context)
      except User.DoesNotExist:
        return HttpResponse("Not Found", status=404)

@login_required
def follow(request, user):
    user = User.objects.get(username=user)
    current_user = request.user
    following = user.followers.all()
   
    if user.username != current_user.username:
        if current_user in following:
            user.followers.remove(current_user.id)
        else:
            user.followers.add(current_user.id)
    return redirect(reverse('feed:home'))

@login_required
def followers(request, username):
    user_object = User.objects.get(username=username)
    followers = user_object.followers.all
    following = user_object.following.all
      
    context = {
      'page_title': "Followers",
      'user': user_object,
      'followers': followers,
      'following': following
    }
    return render(request, 'profile/followers/content.html', context)

@login_required
def following(request, username):
    user_object = User.objects.get(username=username)
    followers = user_object.followers.all
    following = user_object.following.all
    context = {
      'page_title': "Following",
      'user': user_object,
      'followers': followers,
      'following': following
    }
    return render(request, 'profile/following/content.html', context)
    
@login_required
def settings(request):
    profile = request.user
    if request.method == 'POST':
      bio = request.POST['bio']
      location = request.POST['location']
      website = request.POST['website']
      birth_date = request.POST.get('birth_date', None)
      image = request.FILES.get('image', None)
      if image != None:
        profile.avatar = image
      profile.bio = bio
      profile.location = location
      profile.website = website
      profile.birth_date = birth_date
      profile.save()
      return redirect(reverse('accounts:settings'))
    context = {
      'page_title': "Settings",
      'user_profile': profile
    }
    return render(request, 'profile/settings/content.html', context)