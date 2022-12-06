from rest_framework import serializers
from .models import *

class UserFeedImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeedImages
        fields = ['image',]

class FeedCommentsImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeedCommentImages
        fields = ['image',]

class FeedCommentsSerializer(serializers.ModelSerializer):
    comment_image = FeedCommentsImageSerializer(many=True)
    class Meta:
        model = FeedComments
        fields = "__all__"

class UserFeedSerializer(serializers.ModelSerializer):
    images = UserFeedImageSerializer(many=True)
    comments = FeedCommentsSerializer(many=True)

    def get_feed_images(self, instance):
    	qs = FeedImages.objects.filter(feed__id=instance.id)
    	data = UserFeedImageSerializer(qs, many=True).data
    	return data

    def get_feed_comments(self, instance):
        qs = FeedComments.objects.filter(feed__id=instance.id)
        data = FeedCommentsSerializer(qs, many=True).data
        return data
        
    def get_comment_images(self, instance):
        qs = FeedCommentImages.objects.filter(feed__id=instance.id)
        data = FeedCommentsImageSerializer(qs, many=True).data
        return data
    
    class Meta:
        model = Feed
        fields = "__all__"