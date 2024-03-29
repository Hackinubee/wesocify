# Generated by Django 4.1.3 on 2022-11-26 23:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('feed', '0002_feedpoll'),
    ]

    operations = [
        migrations.RenameField(
            model_name='feedpoll',
            old_name='option1',
            new_name='choice_1',
        ),
        migrations.RenameField(
            model_name='feedpoll',
            old_name='option2',
            new_name='choice_2',
        ),
        migrations.RemoveField(
            model_name='feedpoll',
            name='option3',
        ),
        migrations.RemoveField(
            model_name='feedpoll',
            name='option4',
        ),
        migrations.AddField(
            model_name='feedpoll',
            name='choice_3',
            field=models.CharField(blank=True, max_length=25, null=True),
        ),
        migrations.AddField(
            model_name='feedpoll',
            name='choice_4',
            field=models.CharField(blank=True, max_length=25, null=True),
        ),
        migrations.AddField(
            model_name='feedpoll',
            name='votes',
            field=models.IntegerField(default=0),
        ),
    ]
