import React from 'react';
import ImageUpload from './components/ImageUpload';
import MapComponent from './components/MapComponent';
import FarmerDataTable from './components/TableData';

function App() {
  return (
    <div className="container mx-auto p-4">
      <div className="grid md:grid-cols-2 gap-4">
        <ImageUpload />
        <MapComponent />
        <FarmerDataTable />
      </div>
    </div>
  );
}

export default App;