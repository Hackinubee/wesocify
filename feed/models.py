from django.db import models
from accounts.models import *
from django.contrib.auth import get_user_model
from datetime import datetime

User = get_user_model()

class Feed(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    username = models.CharField(max_length=100)
    text = models.TextField(null=True, blank=True)
    likes = models.ManyToManyField(User, blank=True, related_name="feed_likes")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('created_at',)

def get_image_filename(instance, filename):
    feed_id = instance.feed.id
    return "contents/feed/%s/%s" % (feed_id, filename)

def get_comment_image_filename(instance, filename):
    comment_id = instance.comment.id
    return "contents/comment/%s/%s" % (comment_id, filename)

class FeedPoll(models.Model):
    feed = models.ForeignKey(Feed, default=None, related_name="feed_poll", on_delete=models.CASCADE)
    choice_1 = models.CharField(max_length=25)
    choice_2 = models.CharField(max_length=25)
    choice_3 = models.CharField(max_length=25, null=True)
    choice_4 = models.CharField(max_length=25, null=True)
    votes = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

class FeedPollVotes(models.Model):
    poll = models.ForeignKey(FeedPoll, default=None, related_name="feed_poll_votes", on_delete=models.CASCADE)
    voted_by = models.ForeignKey(User, null=False, blank=False, default=None, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

class FeedImages(models.Model):
    feed = models.ForeignKey(Feed, default=None, related_name="images", on_delete=models.CASCADE)
    image = models.ImageField(upload_to=get_image_filename, verbose_name='feed_images', null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

class FeedComments(models.Model):
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.CASCADE)
    feed = models.ForeignKey(Feed, default=None, related_name="comments", on_delete=models.CASCADE)
    username = models.CharField(max_length=100)
    text = models.TextField(null=True, blank=True)
    likes = models.ManyToManyField(User, blank=True, related_name="comment_likes")
    created_at = models.DateTimeField(auto_now_add=True)

class FeedCommentImages(models.Model):
    comment = models.ForeignKey(FeedComments, default=None, related_name="comment_image", on_delete=models.CASCADE)
    feed = models.ForeignKey(Feed, default=None, related_name="comment_image", on_delete=models.CASCADE)
    image = models.ImageField(upload_to=get_comment_image_filename, verbose_name='comment_images', null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)