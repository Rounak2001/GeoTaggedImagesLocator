import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  GoogleMap, 
  LoadScript, 
  Marker, 
  InfoWindow 
} from '@react-google-maps/api';
import axios from 'axios';

const MapComponent = () => {
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [mapError, setMapError] = useState(null);
  const mapRef = useRef(null);

  // Fetch ALL markers from backend
  const fetchAllMarkers = useCallback(async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/post-data/');
      
      // Validate markers before setting
      const validMarkers = response.data.filter(marker => 
        marker.latitude && 
        marker.longitude && 
        !isNaN(marker.latitude) && 
        !isNaN(marker.longitude)
      );

      // Ensure unique markers and sort
      const uniqueMarkers = Array.from(
        new Map(validMarkers.map(marker => [marker.id, marker])).values()
      ).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      setMarkers(uniqueMarkers);

      // Clear any previous map errors
      setMapError(null);
    } catch (error) {
      console.error('Error fetching all markers:', error);
      setMapError('Failed to fetch markers. Please check your backend connection.');
    }
  }, []);

  useEffect(() => {
    fetchAllMarkers();

    // Polling every 30 seconds to get ALL markers
    const intervalId = setInterval(fetchAllMarkers, 30000);

    // Cleanup
    return () => clearInterval(intervalId);
  }, [fetchAllMarkers]);

  // Calculate map center
  const getMapCenter = () => {
    if (markers.length === 0) {
      return { lat: 20.5937, lng: 78.9629 }; // India center
    }

    const totalLat = markers.reduce((sum, marker) => sum + marker.latitude, 0);
    const totalLng = markers.reduce((sum, marker) => sum + marker.longitude, 0);

    return {
      lat: totalLat / markers.length,
      lng: totalLng / markers.length
    };
  };

  // Determine zoom level based on markers
  const getZoomLevel = () => {
    if (markers.length <= 1) return 10;
    if (markers.length <= 5) return 8;
    return 7;
  };

  // Map container style
  const mapContainerStyle = {
    width: '100%',
    height: '500px'
  };

  // Handle map initialization
  const onMapLoad = (map) => {
    mapRef.current = map;
  };

  // Handle map initialization error
  const onMapLoadError = (error) => {
    console.error('Google Maps API failed to load:', error);
    setMapError('Google Maps API failed to load. Please try refreshing the page.');
  };

  return (
    <div className="w-full h-[500px] relative">
      {mapError && (
        <div className="absolute top-2 left-2 z-10 bg-red-100 text-red-800 p-2 rounded-md shadow-md">
          {mapError}
        </div>
      )}

      <div className="absolute top-2 left-2 z-10 bg-white p-2 rounded-md shadow-md">
        <span className="font-bold">Total Markers:</span> {markers.length}
      </div>

      <LoadScript
        googleMapsApiKey="AIzaSyBw7zJazs8P2Bm5L9B4lhvLHoomXm_gaKM" // IMPORTANT: Replace with your valid API key
        onLoad={onMapLoad}
        onError={onMapLoadError}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={getMapCenter()}
          zoom={getZoomLevel()}
          onLoad={(map) => onMapLoad(map)}
        >
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              position={{
                lat: parseFloat(marker.latitude),
                lng: parseFloat(marker.longitude)
              }}
              title={marker.farmer_name}
              icon={{
                url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
                scaledSize: new window.google.maps.Size(40, 40)
              }}
              onClick={() => setSelectedMarker(marker)}
            />
          ))}

          {selectedMarker && (
            <InfoWindow
              position={{
                lat: parseFloat(selectedMarker.latitude),
                lng: parseFloat(selectedMarker.longitude)
              }}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div className="p-2 max-w-[300px]">
                <h3 className="font-bold text-lg mb-2">{selectedMarker.farmer_name}</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p><strong>Farmer ID:</strong> {selectedMarker.farmer_id || 'N/A'}</p>
                  <p><strong>Plant Type:</strong> {selectedMarker.plant_type || 'Not Specified'}</p>
                  <p><strong>Plant Count:</strong> {selectedMarker.plant_count || 'N/A'}</p>
                  <p><strong>Latitude:</strong> {parseFloat(selectedMarker.latitude).toFixed(6)}</p>
                  <p><strong>Longitude:</strong> {parseFloat(selectedMarker.latitude).toFixed(6)}</p>
                  <p><strong>Timestamp:</strong> {new Date(selectedMarker.timestamp).toLocaleString()}</p>
                </div>
                {selectedMarker.image && (
                  <img 
                    src={selectedMarker.image} 
                    alt="Marker Location" 
                    className="mt-2 max-w-full h-auto rounded-md"
                  />
                )}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapComponent;