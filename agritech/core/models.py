# from django.db import models
# from django.contrib.gis.db import models as gis_models
# from django.contrib.gis.geos import Point

# class GeotaggedImage(models.Model):
#     # Image storage
#     image = models.ImageField(upload_to='geotagged_images/')
    
#     # OCR and Image Processing Fields
#     raw_text = models.TextField(blank=True, null=True)
#     processed_data = models.JSONField(blank=True, null=True)
    
#     # Geospatial Information
#     latitude = models.FloatField(null=True, blank=True)
#     longitude = models.FloatField(null=True, blank=True)
#     location = gis_models.PointField(null=True, blank=True)
    
#     # Metadata
#     uploaded_at = models.DateTimeField(auto_now_add=True)
#     processed_at = models.DateTimeField(null=True, blank=True)
    
#     def save(self, *args, **kwargs):
#         # Automatically create Point from latitude and longitude
#         if self.latitude and self.longitude:
#             self.location = Point(self.longitude, self.latitude)
#         super().save(*args, **kwargs)
    
#     def __str__(self):
#         return f"Image at {self.latitude}, {self.longitude} - {self.uploaded_at}"
from django.db import models

class FarmingData(models.Model):
    image = models.ImageField(upload_to='geotagged_images/')
    farmer_id = models.CharField(max_length=50,null=True, blank=True)
    farmer_name = models.CharField(max_length=100,null=True, blank=True)
    latitude = models.FloatField()
    longitude = models.FloatField()
    elevation = models.FloatField(null=True, blank=True)
    accuracy = models.FloatField(null=True, blank=True)
    timestamp = models.DateTimeField(null=True, blank=True)
    plant_type = models.CharField(max_length=100, null=True, blank=True)  # Optional plant type
    plant_count = models.IntegerField(null=True, blank=True)  # Optional plant count
    other_details = models.TextField(null=True, blank=True)  # Store other details here
    
    def __str__(self):
        return f"{self.farmer_name} - {self.plant_type if self.plant_type else 'No plant type'}"

