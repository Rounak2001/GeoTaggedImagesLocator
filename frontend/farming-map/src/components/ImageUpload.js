import React, { useState } from 'react'; 
import axios from 'axios';
import MapComponent from './MapComponent';

const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadedData, setUploadedData] = useState(null);

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);

    // Reset statuses
    setUploadStatus('');
    setUploadedData(null);
  };

  // Handle file upload
  const handleFileUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('Please select an image first');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      setUploadStatus('Uploading...');

      // Upload image
      const response = await axios.post('http://127.0.0.1:8000/api/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Handle successful upload
      setUploadStatus('Upload successful!');
      setUploadedData(response.data);

      // Clear file selection
      setSelectedFile(null);
      setPreviewImage(null);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('Upload failed. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Geotagged Image Upload
      </h2>

      {/* File Input */}
      <div className="mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-2 border rounded-md"
        />
      </div>

      {/* Image Preview */}
      {previewImage && (
        <div className="mb-4 flex justify-center">
          <img
            src={previewImage}
            alt="Preview"
            className="max-w-full h-48 object-cover rounded-md"
          />
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleFileUpload}
        disabled={!selectedFile}
        className={`w-full py-2 rounded-md transition-colors ${
          selectedFile
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        Upload Image
      </button>

      {/* Upload Status */}
      {uploadStatus && (
        <div className={`mt-4 text-center ${
          uploadStatus.includes('successful')
            ? 'text-green-600'
            : 'text-red-600'
        }`}>
          {uploadStatus}
        </div>
      )}

      {/* Uploaded Data Details */}
      {uploadedData && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md">
          <h3 className="font-bold mb-2">Upload Details</h3>
          <div className="grid grid-cols-2 gap-2">
            <p><strong>Farmer Name:</strong> {uploadedData.data.farmer_name || 'N/A'}</p>
            <p><strong>Farmer ID:</strong> {uploadedData.data.farmer_id || 'N/A'}</p>
            <p><strong>Latitude:</strong> {uploadedData.data.latitude || 'N/A'}</p>
            <p><strong>Longitude:</strong> {uploadedData.data.longitude || 'N/A'}</p>
            <p><strong>Plant Type:</strong> {uploadedData.data.plant_type || 'N/A'}</p>
            <p><strong>Plant Count:</strong> {uploadedData.data.plant_count || 'N/A'}</p>
          </div>
        </div>
      )}

      {/* Map Component */}
      <div className="mt-4">
        <MapComponent />
      </div>
    </div>
  );
};

export default ImageUpload; 