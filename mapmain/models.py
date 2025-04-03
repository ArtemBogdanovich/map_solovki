from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=140, unique=True)
    infi = models.TextField()

    def __str__(self):
        return self.name

class MapInfo(models.Model):
    name = models.CharField(max_length=255)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, verbose_name='Историческая эпоха')
    latitude = models.FloatField()  # Поле для хранения широты
    longitude = models.FloatField()  # Поле для хранения долготы
    icons = models.FileField(upload_to='icons/')
    history = models.TextField()
    photos = models.FileField(upload_to='photos/', blank=True, null=True)

    def __str__(self):
        return self.name

