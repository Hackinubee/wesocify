from datetime import datetime
from django.utils import timezone
from django import template

register = template.Library()

@register.filter(name='custom_date')
def custom_date(value):
    """
    Get a timezone object or a int Epoch timestamp and return a shortened string like '1h', '3mo', '5s' etc
    """
    now = timezone.now()
    if type(value) is int:
        diff = now - timezone.fromtimestamp(value)
    elif isinstance(value, datetime):
        diff = now - value
    elif not value:
        diff = 0
    second_diff = diff.seconds
    day_diff = diff.days

    if day_diff < 0:
        return ''

    if day_diff == 0:
        if second_diff < 60:
            return str(second_diff) + "s"
        if second_diff < 3600:
            return str(second_diff // 60) + "m"
        if second_diff < 7200:
            return "1h"
        if second_diff < 86400:
            return str(second_diff // 3600) + "h"
    if day_diff < 7:
        return str(day_diff) + "d"
    if day_diff < 31:
        return str(day_diff // 7) + "w"
    if day_diff < 365:
        return str(day_diff // 30) + "mo"
    return str(day_diff // 365) + "y"