from django.conf import settings
from rest_framework import viewsets
from .models import Category, MapInfo
from .serializers import CategorySerializer, MapInfoSerializer
from rest_framework.decorators import action
from rest_framework.response import Response

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class MapInfoViewSet(viewsets.ModelViewSet):
    queryset = MapInfo.objects.all()
    serializer_class = MapInfoSerializer

    def get_serializer_context(self):
        return {'request': self.request}

    @action(detail=False, methods=['get'])
    def by_category(self, request):
        category_id = request.query_params.get('category_id')
        if category_id:
            queryset = self.queryset.filter(category_id=category_id)
        else:
            queryset = self.queryset
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


from django.shortcuts import render

def mapq(request):
    return render(request, 'map/map.html', {
        'DEBUG': settings.DEBUG  # Передаем DEBUG статус в шаблон
    })