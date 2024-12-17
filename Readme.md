# GeoTagging Project with Azure OCR, Gemini LLM, and Google Maps Integration

## Project Overview
This project enables geotagged image processing, text extraction, and visualization of coordinates on a map. The application allows users to upload images containing geotagged text (latitude, longitude, and related details), extract information using **Azure OCR** and **Gemini LLM**, and display the extracted coordinates on a **Google Map** in the frontend. Additionally, a table lists all the extracted details with options to **delete entries**.

---

## Features
1. **Image Upload:**
   - Users can upload geotagged images through the frontend.
   - Images are processed on the backend.

2. **Text Extraction:**
   - Text is extracted from the uploaded images using **Azure OCR**.

3. **Data Extraction:**
   - Extracted text is analyzed and structured using **Gemini LLM** to extract key details:
     - Latitude
     - Longitude
     - Farmer ID
     - Farmer Name
     - Plant Type
     - Plant Count
     - Village, District, and Timestamp

4. **Google Maps Integration:**
   - Extracted coordinates are visualized as markers on a **Google Map**.
   - All markers are shown as red icons.
   - Users can click a marker to view detailed information.

5. **Table View:**
   - A table lists all extracted data, including:
     - Latitude & Longitude
     - Farmer details
     - Crop-related information
   - Each table row has a **Delete button** to remove specific entries.

6. **Optional Pre-Processing (Advanced):**
   - Techniques like noise removal, thresholding, and text segmentation are optional features to improve OCR accuracy for challenging images.

---

## Tech Stack
### Frontend:
- **React.js**: For the user interface.
- **@react-google-maps/api**: Integration of Google Maps for coordinate visualization.
- **Axios**: HTTP requests for backend communication.

### Backend:
- **Python (Django)**: Handles API endpoints for image upload, text extraction, and data management.
- **Azure OCR**: Extracts raw text from images.
- **Gemini LLM**: Processes extracted text to identify structured details.

### Database:
- **SQLite** (default) or any other relational database supported by Django.

### Deployment:
- Local setup with Django development server and React frontend.

---

## Installation Instructions
Follow these steps to set up the project locally:

### Prerequisites:
- Node.js and npm (for React frontend)
- Python 3.x and pip (for Django backend)
- Azure OCR API Key
- Google Maps API Key

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/geo-tagging-project.git
cd geo-tagging-project
```

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment and install dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate  # For Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```
3. Add your **Azure OCR API key** in the backend settings.
4. Run migrations and start the backend server:
   ```bash
   python manage.py migrate
   python manage.py runserver
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Add your **Google Maps API key** in `MapComponent.js`.
4. Start the frontend server:
   ```bash
   npm start
   ```

### 4. Access the Application
Open your browser and navigate to:
```plaintext
http://localhost:3000
```

---

## Usage
1. **Upload Image**:
   - Click the **"Upload Image"** button on the homepage.
   - Select a geotagged image containing text details.
   - Uploaded image details will be extracted and processed automatically.

2. **View Data**:
   - Extracted latitude and longitude coordinates are displayed as markers on the Google Map.
   - Detailed information about each marker is visible on clicking it.

3. **Table of Details**:
   - A table below the map lists all extracted details.
   - Use the **"Delete"** button to remove unwanted entries.

---

## Example Input & Output
### Example Input:
A geotagged image containing the following text:
```plaintext
Latitude: 19.579036 Longitude: 76.275787
Farmer Id :- 42223
Farmer Name: Annasaheb Vitthalrao Kharat
Crop: Banana
Saplings: 3000
Village: Koregaon, District: Jalna
```

### Example Output:
- **Google Map Marker**:
   - Latitude: `19.579036`, Longitude: `76.275787`
- **Table Entry**:
   | Farmer ID | Farmer Name           | Latitude   | Longitude  | Crop   | Saplings | Village  | District |
   |-----------|----------------------|------------|------------|--------|----------|----------|----------|
   | 42223     | Annasaheb Kharat     | 19.579036  | 76.275787  | Banana | 3000     | Koregaon | Jalna    |

---

## Optional Features
The following advanced techniques can be implemented optionally to improve OCR accuracy:
1. **Image Pre-Processing**:
   - Noise removal
   - Binarization (thresholding)
   - Text segmentation
   - Skew correction
2. **Custom OCR Configuration**:
   - Whitelisting specific characters
   - Language-specific OCR models
3. **Error Handling**:
   - Handle low-quality or incomplete images.

---

## Future Enhancements
- Implement pre-processing techniques for advanced OCR handling.
- Support multiple languages for text extraction.
- Deploy the project to a cloud platform (e.g., AWS, Azure).
- Add authentication for secure access.

---


## Acknowledgements
- **Azure OCR** for text extraction.
- **Gemini LLM** for advanced text analysis.
- **Google Maps API** for geolocation visualization.
- **React.js** and **Django** for frontend and backend development.

---

Thank you! 😊
