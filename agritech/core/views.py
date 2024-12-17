from django.utils import timezone
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from .models import FarmingData
from .serializers import FarmingDataSerializer
from .utils import extract_ocr_details, azure_ocr_extract


class FarmingDataProcessView(APIView):
    def post(self, request):
        image_file = request.FILES.get('image', None)
        if not image_file:
            return Response({'error': 'No image file provided'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Extract text using Azure OCR
            extracted_text = azure_ocr_extract(image_file)
            if not extracted_text:
                return Response({'error': 'Failed to extract text from image'}, status=status.HTTP_400_BAD_REQUEST)

            print("Extracted OCR Text:", extracted_text)  # Debugging Output

            # Ensure extract_ocr_details returns a list and take the first item
            details = extract_ocr_details(extracted_text)
            if not details:
                return Response({'error': 'No details extracted from image'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Take the first (and likely only) item from the list
            details = details[0] if isinstance(details, list) else details

            # Safe extraction function
            def safe_extract(key, type_converter=str):
                value = details.get(key)
                
                # Handle different possible return types
                if value is None:
                    return None
                
                # If it's already the correct type, return it
                if isinstance(value, type_converter):
                    return value
                
                # If it's a tuple, take the first element
                if isinstance(value, tuple):
                    value = value[0] if value else None
                
                # Convert to desired type
                try:
                    return type_converter(value) if value is not None else None
                except (ValueError, TypeError):
                    return None

            # Extract and convert values
            farmer_id = safe_extract('farmer_id')
            farmer_name = safe_extract('farmer_name')
            
            # Numeric fields need explicit float/int conversion
            latitude = safe_extract('latitude', float)
            longitude = safe_extract('longitude', float)
            elevation = safe_extract('elevation', float)
            accuracy = safe_extract('accuracy', float)
            plant_count = safe_extract('plant_count', int)
            
            plant_type = safe_extract('plant_name')
            timestamp = safe_extract('timestamp')
            other_details = safe_extract('other_details')

            # Validate coordinates
            if latitude is None or longitude is None:
                return Response({
                    'error': 'Incomplete location data',
                    'details': details
                }, status=status.HTTP_400_BAD_REQUEST)

            # Save to database
            farming_data = FarmingData.objects.create(
                image=image_file,
                farmer_id=farmer_id,
                farmer_name=farmer_name,
                latitude=latitude,
                longitude=longitude,
                elevation=elevation,
                accuracy=accuracy,
                timestamp=timestamp or timezone.now(),
                plant_type=plant_type,
                plant_count=plant_count,
                other_details=other_details
            )

            # Serialize data
            serializer = FarmingDataSerializer(farming_data)

            return Response({
                "message": "Farming data processed successfully.",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({
                'error': f"Data extraction error: {str(e)}",
                'details': details  # Include details for debugging
            }, status=status.HTTP_400_BAD_REQUEST)


class FarmerDataViewSet(viewsets.ModelViewSet):
    queryset = FarmingData.objects.all()  # Retrieve all records
    serializer_class = FarmingDataSerializer

    def create(self, request, *args, **kwargs):
        """
        Override the create method to disable POST requests.
        """
        return Response(
            {"error": "POST requests are not allowed on this endpoint."},
            status=status.HTTP_405_METHOD_NOT_ALLOWED
        )
