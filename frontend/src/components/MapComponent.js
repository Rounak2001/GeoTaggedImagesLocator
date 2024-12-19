import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  GoogleMap, 
  useJsApiLoader,  // Changed from LoadScript
  Marker, 
  InfoWindow 
} from '@react-google-maps/api';
import axios from 'axios';

const MapComponent = () => {
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [mapError, setMapError] = useState(null);
  const mapRef = useRef(null);

  // Use useJsApiLoader instead of LoadScript
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBw7zJazs8P2Bm5L9B4lhvLHoomXm_gaKM", // Replace with your API key
    id: 'google-map-script'
  });

  const mapContainerStyle = {
    width: '100%',
    height: '500px'
  };

  const defaultCenter = {
    lat: 20.5937,
    lng: 78.9629
  };

  const fetchAllMarkers = useCallback(async () => {
    try {
      const response = await axios.get('https://geotaggedimageslocator-2.onrender.com/api/post-data/');
      
      const validMarkers = response.data
        .filter(marker => 
          marker.latitude && 
          marker.longitude && 
          !isNaN(parseFloat(marker.latitude)) && 
          !isNaN(parseFloat(marker.longitude))
        )
        .map(marker => ({
          ...marker,
          latitude: parseFloat(marker.latitude),
          longitude: parseFloat(marker.longitude)
        }));

      setMarkers(validMarkers);
    } catch (error) {
      console.error('Error fetching markers:', error);
      setMapError('Failed to fetch markers');
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      fetchAllMarkers();
    }
  }, [isLoaded, fetchAllMarkers]);

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    
    if (markers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      markers.forEach(marker => {
        bounds.extend({ 
          lat: parseFloat(marker.latitude), 
          lng: parseFloat(marker.longitude) 
        });
      });
      map.fitBounds(bounds);
    }
  }, [markers]);

  if (loadError) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center bg-red-50">
        <div className="text-red-600">
          Error loading maps. Please check your API key.
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-[500px] relative">
      {mapError && (
        <div className="absolute top-2 left-2 z-10 bg-red-100 text-red-800 p-3 rounded-md shadow-md">
          {mapError}
        </div>
      )}

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultCenter}
        zoom={5}
        onLoad={onMapLoad}
        options={{
          fullscreenControl: true,
          streetViewControl: false,
          mapTypeControl: true,
          zoomControl: true,
        }}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={{
              lat: marker.latitude,
              lng: marker.longitude
            }}
            title={marker.farmer_name}
            onClick={() => setSelectedMarker(marker)}
          />
        ))}

        {selectedMarker && (
          <InfoWindow
            position={{
              lat: selectedMarker.latitude,
              lng: selectedMarker.longitude
            }}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="p-3 max-w-[300px]">
              <h3 className="font-bold text-lg mb-2">{selectedMarker.farmer_name}</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p><strong>Farmer ID:</strong> {selectedMarker.farmer_id || 'N/A'}</p>
                <p><strong>Plant Type:</strong> {selectedMarker.plant_type || 'N/A'}</p>
                <p><strong>Plant Count:</strong> {selectedMarker.plant_count || 'N/A'}</p>
                <p><strong>Latitude:</strong> {selectedMarker.latitude.toFixed(6)}</p>
                <p><strong>Longitude:</strong> {selectedMarker.longitude.toFixed(6)}</p>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default MapComponent;