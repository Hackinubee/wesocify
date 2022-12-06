from django import forms
from .models import *
from django.core.exceptions import ValidationError

class postForm(forms.ModelForm):
	""" 
	Creates a form for creating a new post
	"""
	text = forms.CharField(max_length=500, widget=forms.Textarea)
	
	class Meta:
		model = Feed
		fields = ('text',)
		
class pollForm(forms.ModelForm):
  choice_1 = forms.CharField(max_length=25)
  choice_2 = forms.CharField(max_length=25)
  choice_3 = forms.CharField(max_length=25, required=False)
  choice_4 = forms.CharField(max_length=25, required=False)
  #poll_days = forms.ChoiceField()
  #poll_hours = forms.ChoiceField()
  #poll_minutes = forms.ChoiceField()
  
  class Meta:
    model = FeedPoll
    fields = ('choice_1', 'choice_2', 'choice_3', 'choice_4',)

class post_image_form(forms.ModelForm):
	""" 
	Creates a form for uploading an image for a post
	"""
	image = forms.ImageField(required=False, label='Image')
	class Meta:
		model = FeedImages
		fields = ('image',)