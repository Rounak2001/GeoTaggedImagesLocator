// import React from 'react';
// import ImageUpload from './components/ImageUpload';
// import MapComponent from './components/MapComponent';
// import FarmerDataTable from './components/TableData';

// function App() {
//   return (
//     <div className="container mx-auto p-4">
//       <div className="grid md:grid-cols-2 gap-4">
//         <ImageUpload />
//         <MapComponent />
//         <FarmerDataTable />
//       </div>
//     </div>
//   );
// }

// export default App;

// App.js or your main container component
import React from 'react';
import ImageUpload from './components/ImageUpload';
import MapComponent from './components/MapComponent';
import FarmerDataTable from './components/TableData';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-gray-800">Farmer Data Management</h1>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Image Upload Section */}
            <div className="bg-white rounded-lg shadow">
              <ImageUpload />
            </div>
            
            {/* Map Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Location Map</h2>
              <MapComponent />
            </div>
          </div>

          {/* Right Column - Data Table */}
          <div className="bg-white rounded-lg shadow">
            <FarmerDataTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;