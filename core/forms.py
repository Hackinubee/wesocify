from django import forms
from .models import *

class login_form(forms.Form):
	""" 
	Creates a form for logging in users
	"""
	username = forms.CharField()
	password = forms.CharField(widget=forms.PasswordInput)