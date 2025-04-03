from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, MapInfoViewSet, mapq
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'mapinfo', MapInfoViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('', mapq, name='map'),  # Маршрут для вашего HTML шаблона по умолчанию
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
