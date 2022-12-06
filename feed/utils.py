from .models import *
from django.db.models import Q
from accounts.models import *
from itertools import chain
import random

PER_PAGE = 10

""" Helper functions """
def list_to_string(list):
	""" 
	Returns a list as string
	"""
	init_str = " "
	return(init_str.join(list))

def pagination(request, obj):
    if request.method == "POST":
    	page = request.POST['page']
    page = 1
    start = (page - 1) * PER_PAGE
    end = start + PER_PAGE
    feed_list = [feed for feed in obj]
    feed = feed_list[start:end]
    
    return feed

def get_user_followers(obj):
    user_followers = obj.followers.all()
    followers = []
    for follow in user_followers:
      followers.append(follow.username)
    return followers

def get_user_following(obj):
    user_following = obj.following.all()
    following = []
    for follow in user_following:
      following.append(follow.username)
    return following

"""
Returns the list of feeds related to the user
"""
def get_user_feed(request):
	user_following_list = []
	feed_list = []
	feed_object = Feed.objects.select_related('user').filter(user__username=request.user.username).order_by('-id')
	feed_list.append(feed_object)
	
	user_following = request.user.following.all()
	for following in user_following:
	  feed_object = Feed.objects.filter(user__id=following.id).order_by('-id')
	  feed_list.append(feed_object)

	output = list(chain(*feed_list))
	return output

"""
Returns the list of user suggestions
"""
def get_user_suggestions(request):
    all_users = User.objects.all()
    user_following_all = []

    for user in get_user_following(request):
        user_list = User.objects.get(id=user.id)
        user_following_all.append(user_list)
    
    new_suggestions_list = [x for x in list(all_users) if (x not in list(user_following_all))]
    current_user = get_user_object(request)
    final_suggestions_list = [x for x in list(new_suggestions_list) if (x not in list(current_user))]
    random.shuffle(final_suggestions_list)

    username_profile = []
    username_profile_list = []

    for users in final_suggestions_list:
        username_profile.append(users.id)

    for ids in username_profile:
        profile_lists = User.objects.filter(id=ids)
        username_profile_list.append(profile_lists)

    return list(chain(*username_profile_list))
'''
Returns comment of user's following & user's comment on a feed
'''
def get_following_comment(following):
  try:
    output = []
    for follow in following:
      comment = FeedComments.objects.select_related().filter(user__username=follow)[:1]
      for c in comment:
        output.append(c)
    return output
  except Feed.DoesNotExist:
    return None

def pretty_date(time=False):
    """
    Get a datetime object or a int() Epoch timestamp and return a
    pretty string like 'an hour ago', 'Yesterday', '3 months ago',
    'just now', etc
    """
    from datetime import datetime
    now = datetime.now()
    if type(time) is int:
        diff = now - datetime.fromtimestamp(time)
    elif isinstance(time, datetime):
        diff = now - time
    elif not time:
        diff = 0
    second_diff = diff.seconds
    day_diff = diff.days

    if day_diff < 0:
        return ''

    if day_diff == 0:
        if second_diff < 10:
            return "just now"
        if second_diff < 60:
            return str(second_diff) + " seconds ago"
        if second_diff < 120:
            return "a minute ago"
        if second_diff < 3600:
            return str(second_diff // 60) + " minutes ago"
        if second_diff < 7200:
            return "an hour ago"
        if second_diff < 86400:
            return str(second_diff // 3600) + " hours ago"
    if day_diff == 1:
        return "Yesterday"
    if day_diff < 7:
        return str(day_diff) + " days ago"
    if day_diff < 31:
        return str(day_diff // 7) + " weeks ago"
    if day_diff < 365:
        return str(day_diff // 30) + " months ago"
    return str(day_diff // 365) + " years ago"