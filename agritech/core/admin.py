from django.contrib import admin
from .models import FarmingData

# Custom Admin Class to Display OCR Data
class OCRDataAdmin(admin.ModelAdmin):
    list_display = ('id', 'latitude', 'longitude', 'elevation', 'accuracy', 'timestamp', 'farmer_id', 'farmer_name', 'other_details')
    search_fields = ('latitude', 'longitude', 'farmer_id', 'farmer_name')
    list_filter = ('timestamp', 'farmer_name')
    readonly_fields = ('latitude', 'longitude', 'elevation', 'accuracy', 'timestamp', 'farmer_id', 'farmer_name', 'other_details')

# Register the model with the custom admin class
admin.site.register(FarmingData, OCRDataAdmin)
