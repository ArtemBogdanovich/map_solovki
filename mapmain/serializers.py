from rest_framework import serializers
from .models import Category, MapInfo

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'infi']

class MapInfoSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    icons_url = serializers.SerializerMethodField()
    photos_url = serializers.SerializerMethodField()

    class Meta:
        model = MapInfo
        fields = ['id', 'name', 'category', 'latitude', 'longitude',
                 'icons', 'icons_url', 'history', 'photos', 'photos_url']

    def get_icons_url(self, obj):
        if obj.icons:
            return self.context['request'].build_absolute_uri(obj.icons.url)
        return None

    def get_photos_url(self, obj):
        if obj.photos:
            return self.context['request'].build_absolute_uri(obj.photos.url)
        return None