# Generated by Django 5.1.7 on 2025-03-30 19:50

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=140, unique=True)),
                ('infi', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='MapInfo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('latitude', models.FloatField()),
                ('longitude', models.FloatField()),
                ('icons', models.FileField(upload_to='icons/')),
                ('history', models.TextField()),
                ('photos', models.FileField(upload_to='photos/')),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='mapmain.category', verbose_name='Историческая эпоха')),
            ],
        ),
    ]
