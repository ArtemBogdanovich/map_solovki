# Generated by Django 5.1.7 on 2025-04-01 23:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mapmain', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mapinfo',
            name='photos',
            field=models.FileField(blank=True, null=True, upload_to='photos/'),
        ),
    ]
