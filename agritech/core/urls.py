from django.urls import path, include
from .views import FarmingDataProcessView, FarmerDataViewSet
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r'post-data', FarmerDataViewSet)


urlpatterns = [
    path('upload/', FarmingDataProcessView.as_view(), name='farming data process'), 
    path('', include(router.urls)),
]