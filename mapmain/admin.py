from django.contrib import admin
from .models import MapInfo, Category
from django_summernote.admin import SummernoteModelAdmin

class Text1(SummernoteModelAdmin):
    summernote_fields = ('history',)

admin.site.register(MapInfo, Text1)
admin.site.register(Category)
