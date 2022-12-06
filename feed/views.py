from django.shortcuts import render, redirect
from django.template.loader import render_to_string
from django.urls import reverse
from django.contrib import messages
from django.conf import settings
from django.http import HttpResponse, JsonResponse, Http404
from django.contrib.auth.decorators import login_required
from accounts.models import *
from moments.models import *
from .models import *
from .forms import *
from .utils import *
from .serializers import *
from rest_framework import generics
from itertools import chain

class FeedListAPI(generics.ListAPIView):
    """ 
    API endpoint for fetching all user feeds
    """
    queryset = Feed.objects.order_by('-id')
    serializer_class = UserFeedSerializer

class GetFeedAPI(generics.RetrieveAPIView):
    """ 
    API endpoint for retreiving feed by ID
    """
    queryset = Feed.objects.all()
    serializer_class = UserFeedSerializer
    
class PostFeedAPI(generics.CreateAPIView):
    """ 
    API endpoint for posting a feed
    """
    queryset = Feed.objects.all()
    serializer_class = UserFeedSerializer

class FeedView():
    @login_required
    def compose(request):
      hours = [*range(0, 24)]
      minutes =[*range(0, 60)]
      context = {
      'page_title': "Compose Feed",
      'post_form': postForm(),
      'poll_form': pollForm(),
      'poll_hours': hours,
      'poll_minutes': minutes,
      }
      return render(request, 'feed/compose/content.html', context)
      
    @login_required
    def view(request, username, pk):
        try:
            feed_object = Feed.objects.get(id=pk, user__username=username)
            user_object = request.user
            followers = get_user_followers(feed_object.user)
            context = {
            'page_title': "Feed",
            'user_profile': user_object,
            'post': feed_object,
            'followers': followers
            }
            return render(request, 'feed/view.html', context)
        except Feed.DoesNotExist:
            return render(request, 'errors/404.html')
            
    @login_required
    def get(request):
        try:
            feed_object = get_user_feed(request)
            feed = pagination(request, feed_object)
            user_following = get_user_following(request.user)
            follow_comment = get_following_comment(user_following)
            user_object = request.user
            context = {
            'page_title': "Home",
            'post_form': postForm(),
            'user_profile': user_object,
            'following': user_following,
            'posts': feed,
            'follow_comment': follow_comment,
            }
        
            return render(request, 'feed/content.html', context)
        
        except Feed.DoesNotExist:
            return render(request, 'feed/content.html', context)

    @login_required
    def suggestions(request):
        try:
            obj = get_user_suggestions(request)
            context = {
            'suggestions': obj[:4]
            }
            return render(request, 'feed/suggestions.html', context)
            
        except Exception as e:
            return render(request, 'feed/suggestions.html', context)

    @login_required
    def vote(request):
      if request.method == 'POST':
        choice = request.POST.get('choice', None)
        feed = request.POST.get('feed', None)
        poll = request.POST.get('poll', None)
        print(choice, feed, poll)

    @login_required
    def post(request):
        if request.method == 'POST':
            form = postForm(request.POST or None, request.FILES or None)
            poll = pollForm(request.POST or None)
            images = request.FILES.getlist('image')
            is_poll = request.POST.get('poll', 0)
            if form.is_valid():
                username = request.user.username
                user_id = request.user.id
                text = form.cleaned_data['text']
                feed = Feed.objects.create(user_id=user_id, username=username, text=text)
                if int(is_poll) == 1:
                  if poll.is_valid():
                    choice_1 = poll.cleaned_data['choice_1']
                    choice_2 = poll.cleaned_data['choice_2']
                    choice_3 = poll.cleaned_data['choice_3']
                    choice_4 = poll.cleaned_data['choice_4']
                    #days = poll.cleaned_data['poll_days']
                    #hours = poll.cleaned_data['poll_hours']
                    #minutes = poll.cleaned_data['poll_minutes']
                    feed_poll = FeedPoll.objects.create(feed=feed, choice_1=choice_1, choice_2=choice_2, choice_3=choice_3, choice_4=choice_4)
                    feed_poll.save()
                for image in images:
                  feed_images = FeedImages.objects.create(feed=feed, image=image)
                  feed_images.save()
                feed.save()
                data = {
                    'post': feed,
                }
                return render(request, 'feed/partials/feed.html', data)
            else:
                return JsonResponse({'scode': 403, 'message': 'Invalid form'}, status=403)
        else:
            return JsonResponse({'scode': 403, 'message': 'Not Allowed'}, status=403)

    @login_required
    def update(request):
        if request.method == 'POST':
            content = request.POST['content']
            feed_id = request.POST['id']
            instance = Feed.objects.filter(id=feed_id).update(text=content.strip())
            if instance == 1:
                feed_object = Feed.objects.get(id=feed_id)
                page = render_to_string('feed/partials/feed.html', {'post': feed_object})
                return JsonResponse({'scode': 200, 'feed': page})
            return JsonResponse({'scode': 403}, status=403)

    @login_required
    def delete(request):
        if request.method == "POST":
            feed_id = request.POST['id']
            feed_object = Feed.objects.filter(id=feed_id)

            if Feed.objects.filter(id=feed_id).exists():
                feed_object.delete()
                return JsonResponse({'scode': 200})
            return JsonResponse({'scode': 422})
        return JsonResponse({'scode': 404})

    @login_required
    def like(request, pk):
        if request.method == "POST":
            feed_type = request.POST.get('type', 0)
            username = request.user.username
            user_id = request.user.id
            post_id = pk
            instance = Feed.objects.get(id=pk)
            if not instance.likes.filter(id=user_id).exists():
                instance.likes.add(request.user)
                instance.save()
                if int(feed_type) == 1:
                   return render(request, 'profile/partials/feed.html', context={'post': instance})
                return render(request, 'feed/partials/feed.html', context={'post': instance})
            else:
                instance.likes.remove(request.user)
                instance.save()
                if int(feed_type) == 1:
                   return render(request, 'profile/partials/feed.html', context={'post': instance})
                return render(request, 'feed/partials/feed.html', context={'post': instance})
        else:
            return redirect(reverse('home'))

    @login_required
    def share(request):
        pass
    
    @login_required
    def menu(request, pk):
        try:
            feed_object = Feed.objects.get(id=pk)
            user_followers = get_user_followers(feed_object.user)
            return render(request, 'feed/modals/view/menu.html', {'post': feed_object, 'followers': user_followers})
        except Feed.DoesNotExist:
            return JsonResponse({'scode': 404}, status=404)

    @login_required
    def more(request):
        feed_output = []
        lid = []
        if request.method == "POST":
            counter = request.POST['page']
            counter = int(counter)
            if not counter:
                return render(request, 'feed/partials/no-more-data.html')
            else:
                feed_object = Feed.objects.filter(username=request.user.username, user_id=request.user.id).order_by('-id')
                feed = pagination(request, feed_object)
                for f in feed:
                    lid.append(f.id)
        else:
            return None
        feed_output.append(feed_object)
        feed_list = list(chain(*feed_output))
        
        lid = lid[-1:]
        if len(lid) == 1:
            last_id = lid[0]
        else:
            last_id = ""

        context = {
            'posts': feed_list,
            'lid': last_id,
        }

        return render(request, 'feed/partials/filter.html', context)

class CommentView():
    @login_required
    def get(request, feed_id):
        post_object = Feed.objects.get(id=feed_id)
        comment_object = FeedComments.objects.filter(feed__id=feed_id)
        if comment_object.exists():
            page = render_to_string('feed/partials/comment.html', {'post': post_object, 'comment': comment_object})
            return JsonResponse({'scode': 200, 'comment': page})
        return JsonResponse({'scode': 403})

    @login_required
    def post(request):
        if request.method == 'POST':
            if (request.POST or None) or (request.FILES or None):
                images = request.FILES.getlist('comment-image')
                username = request.user.username
                user_id = request.user.id
                feed_id = request.POST['target']
                text = request.POST['comment']
                post_object = Feed.objects.get(id=feed_id)
                comment_obj = FeedComments.objects.create(user_id=user_id, username=username, text=text, feed_id=feed_id)
                comment_obj.save()
                for img in images:
                    FeedCommentImages.objects.create(comment=comment_obj, feed_id=feed_id, image=img)
                comment = comment_obj
                data = {'post': post_object, 'comment': comment}
                comment_view = render_to_string('feed/partials/comment.html', data)
                return JsonResponse({'scode': 200, 'comment': comment_view})
            return JsonResponse({'scode': 403, 'message': 'Not Allowed'}, status=403)
        else:
            return JsonResponse({'scode': 403, 'message': 'Not Allowed'}, status=403)

@login_required
def search(request):
    if request.method == 'POST':
        username = request.POST['username']
        username_object = User.objects.filter(username__icontains=username)
    else:
        return render(request, 'search/content.html')
    return render(request, 'search/results.html', {'user_profile_list': username_object})