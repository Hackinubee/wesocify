from django.shortcuts import render, redirect
from django.urls import reverse
from django.contrib.auth.models import User, auth
from django.contrib import messages
from django.conf import settings
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from .forms import login_form
from accounts.models import *

def register(request):
  if request.user.is_authenticated:
    return redirect(reverse('feed:home'))
  else:
    if request.method == 'POST':
        name = request.POST['name']
        username = request.POST['username']
        email = request.POST['email']
        password = request.POST['password']
        password2 = request.POST['cpassword']
        birth_date = request.POST['birth_date']

        if password == password2:
            if User.objects.filter(email=email).exists():
                messages.info(request, 'An account with that e-mail already exists')
                return redirect(reverse('core:register'))
            elif User.objects.filter(username=username).exists():
                messages.info(request, 'The username has been taken, try another')
                return redirect(reverse('core:register'))
            else:
                user = User.objects.create_user(username=username, name=name, email=email, password=password, birth_date=birth_date)
                user.save()
                user_login = auth.authenticate(username=username, password=password)
                auth.login(request, user_login)

                return redirect(reverse('accounts:settings'))
        else:
            messages.info(request, 'The password does not match')
            return redirect(reverse('core:welcome'))
        
    else:
        return render(request, 'welcome/register.html', {'page_title': "Register an account"})

def welcome(request):
  if request.user.is_authenticated:
    return redirect(reverse('feed:home'))
  else:
    if request.method == 'POST':
        form = login_form(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = auth.authenticate(username=username, password=password)
            if user:
                auth.login(request, user)
                return redirect(reverse('feed:home'))
            else:
                form = login_form(initial={'username': username, 'password': password})
                return render(request, 'welcome/content.html', {'page_title': "Welcome", 'form': form, 'error': 'Invalid credentials'})
        else:
            form = login_form(initial={'username': username, 'password': password})
            return render(request, 'welcome.html', {'page_title': "Welcome", 'form': form})
    else:
        form = login_form()
        return render(request, 'welcome/content.html', {'page_title': "Welcome", 'form': form})

def terms(request):
    return render(request, 'welcome/terms.html')

def privacy_policy(request):
    return render(request, 'welcome/privacy-policy.html')

@login_required
def logout(request):
  if request.user.is_authenticated:
    auth.logout(request)
    response = HttpResponse()
    response['HX-Redirect'] = reverse("core:welcome")
    return redirect(reverse('core:welcome'))
