import React, { useState, useCallback } from 'react'; 
import axios from 'axios';
import MapComponent from './MapComponent';

const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadedData, setUploadedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Validate file type and size
  const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      return 'Please select a valid image file (JPEG, PNG)';
    }
    if (file.size > maxSize) {
      return 'File size must be less than 5MB';
    }
    return null;
  };

  // Handle file selection
  const handleFileChange = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      setPreviewImage(null);
      return;
    }

    setError(null);
    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.onerror = () => {
      setError('Failed to read file');
      setPreviewImage(null);
    };
    reader.readAsDataURL(file);

    // Reset statuses
    setUploadStatus('');
    setUploadedData(null);
  }, []);

  // Handle file upload
  const handleFileUpload = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      setIsLoading(true);
      setError(null);
      setUploadStatus('Uploading...');

      const response = await axios.post('https://geotaggedimageslocator-2.onrender.com/api/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 30000 // 30 second timeout
      });

      // Validate response data
      if (!response.data || !response.data.data) {
        throw new Error('Invalid response from server');
      }

      // Handle successful upload
      setUploadStatus('Upload successful!');
      setUploadedData(response.data);

      // Clear file selection
      setSelectedFile(null);
      setPreviewImage(null);
    } catch (error) {
      console.error('Upload error:', error);
      setError(
        error.response?.data?.message || 
        'Upload failed. Please check your connection and try again.'
      );
      setUploadStatus('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Geotagged Image Upload
      </h2>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* File Input */}
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Select Image
        </label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/jpg"
          onChange={handleFileChange}
          className="w-full p-2 border rounded-md text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          disabled={isLoading}
        />
        <p className="mt-1 text-sm text-gray-500">
          Max file size: 5MB. Supported formats: JPEG, PNG
        </p>
      </div>

      {/* Image Preview */}
      {previewImage && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Preview</p>
          <div className="flex justify-center bg-gray-50 p-2 rounded-md">
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full h-48 object-cover rounded-md"
            />
          </div>
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleFileUpload}
        disabled={!selectedFile || isLoading}
        className={`w-full py-2 px-4 rounded-md transition-colors ${
          selectedFile && !isLoading
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {isLoading ? 'Uploading...' : 'Upload Image'}
      </button>

      {/* Upload Status */}
      {uploadStatus && !error && (
        <div className="mt-4 text-center text-green-600">
          {uploadStatus}
        </div>
      )}

      {/* Uploaded Data Details */}
      {uploadedData && (
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h3 className="font-bold mb-3">Upload Details</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <p><strong>Farmer Name:</strong> {uploadedData.data.farmer_name || 'N/A'}</p>
            <p><strong>Farmer ID:</strong> {uploadedData.data.farmer_id || 'N/A'}</p>
            <p><strong>Latitude:</strong> {uploadedData.data.latitude?.toFixed(6) || 'N/A'}</p>
            <p><strong>Longitude:</strong> {uploadedData.data.longitude?.toFixed(6) || 'N/A'}</p>
            <p><strong>Plant Type:</strong> {uploadedData.data.plant_type || 'N/A'}</p>
            <p><strong>Plant Count:</strong> {uploadedData.data.plant_count || 'N/A'}</p>
          </div>
        </div>
      )}

      {/* Map Component */}
      {/* <div className="mt-6">
        <MapComponent />
      </div> */}
    </div>
  );
};

export default ImageUpload;