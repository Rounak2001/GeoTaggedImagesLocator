import re
import os
from datetime import datetime
from typing import Dict, Optional
from azure.cognitiveservices.vision.computervision import ComputerVisionClient
from azure.cognitiveservices.vision.computervision.models import OperationStatusCodes
from msrest.authentication import CognitiveServicesCredentials
import google.generativeai as genai
from django.conf import settings
from django.utils import timezone
import time,os
from dotenv import load_dotenv

import re
from typing import Optional, Union

import re
import json
from typing import Dict, Optional
import google.generativeai as genai
from datetime import datetime

class OCRTextExtractor:
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize the OCR text extractor with Gemini API
        
        Args:
            api_key (Optional[str]): Google Gemini API key
        """
        # Use provided API key or fetch from settings
        api_key = "AIzaSyD70r14I6_X1C4pugbLZ7AvR15Sp7VYAU4"
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-pro')

    def extract_details(self, extracted_text: str) -> Dict[str, Optional[str]]:
        """
        Extract structured details from multi-line OCR text
        """
        prompt = f"""
        Extract structured information from the following OCR text. 
        The text is line-by-line, so carefully parse each line.

        Rules for Extraction:
        1. Look for key-value pairs separated by ':' or '-:'
        2. Key examples: Latitude, Longitude, Elevation, Accuracy, Farmer Id, Farmer Name, Crop, Saplings, Time
        3. Extract the most precise value for each key
        4. Handle multilingual and varied text formats
        5. If a field is not clearly present, use null

        Text to Extract:
        {extracted_text}

        Respond in strict JSON format:
        {{
            "latitude": float or null,
            "longitude": float or null,
            "elevation": float or null,
            "accuracy": float or null,
            "farmer_id": string or null,
            "farmer_name": string or null,
            "plant_name": string or null,
            "plant_count": int or null,
            "timestamp": string or null,
            "other_details": string or null
        }}

        Additional Guidelines:
        - Carefully parse each line
        - Remove any extra whitespaces
        - Be precise in value extraction
        - Consider variations in text like 'Farmer Id', 'Id', 'Id:-' etc.
        """

        try:
            # Generate response from Gemini
            response = self.model.generate_content(prompt)
            
            # Parse the response
            details = json.loads(response.text)
            
            # Additional processing for timestamp
            if details.get('timestamp'):
                details['timestamp'] = self._parse_timestamp(details['timestamp'])
            
            return details
        
        except Exception as e:
            # Fallback to regex extraction if Gemini fails
            return self._fallback_extract(extracted_text)
       
    def _parse_timestamp(self, timestamp_str: str) -> Optional[str]:
        """
        Parse timestamp string into a standardized format
        
        Args:
            timestamp_str (str): Raw timestamp string
        
        Returns:
            Parsed timestamp or None
        """
        timestamp_formats = [
            "%d-%m-%Y %H:%M",    # 24-06-2024 08:30
            "%d-%m-%Y %I:%M %p", # 29-06-2024 11:11 AM
            "%d %B %Y %I:%M %p", # 17 April 2024 8:59 pm
            "%d %b %Y %I:%M %p"  # 17 Apr 2024 8:59 pm
        ]
        
        for fmt in timestamp_formats:
            try:
                parsed_time = datetime.strptime(timestamp_str, fmt)
                return parsed_time.strftime("%Y-%m-%d %H:%M:%S")
            except ValueError:
                continue
        
        return None

    def _fallback_extract(self, extracted_text: str) -> Dict[str, Optional[str]]:
        """
        Fallback extraction method using regex
        
        Args:
            extracted_text (str): Raw OCR text
        
        Returns:
            Dict of extracted details
        """
        # Regex patterns for extraction
        details = {
            'latitude': self._extract_float(r'Latitude\s*[:]\s*([-\d.]+)', extracted_text),
            'longitude': self._extract_float(r'Longitude\s*[:]\s*([-\d.]+)', extracted_text),
            'elevation': self._extract_float(r'Elevation\s*[:]\s*([\d.]+)', extracted_text),
            'accuracy': self._extract_float(r'Accuracy\s*[:]\s*([\d.]+)\s*m', extracted_text),
            'farmer_id': self._extract_value(r'Farmer\s*(?:Id|I\'d)\s*[:]\s*(\d+)', extracted_text),
            'farmer_name': self._extract_value(r'Farmer\s*Name\s*[:]\s*([\w\s]+)', extracted_text),
            'plant_name': self._extract_value(r'(?:Crop|Plant)\s*[:]\s*([\w\s]+)', extracted_text),
            'plant_count': self._extract_int(r'(?:Sapling|Saplings)\s*[:]\s*(\d+)', extracted_text),
            'timestamp': self._extract_timestamp(extracted_text),
            'other_details': self._extract_other_details(extracted_text)
        }
        
        return details

    def _extract_float(self, pattern: str, text: str, flags: int = re.IGNORECASE) -> Optional[float]:
        """Extract float value using regex."""
        match = re.search(pattern, text, flags)
        return float(match.group(1)) if match else None

    def _extract_value(self, pattern: str, text: str, flags: int = re.IGNORECASE) -> Optional[str]:
        """Extract string value using regex."""
        match = re.search(pattern, text, flags)
        return match.group(1).strip() if match else None

    def _extract_int(self, pattern: str, text: str, flags: int = re.IGNORECASE) -> Optional[int]:
        """Extract integer value using regex."""
        match = re.search(pattern, text, flags)
        return int(match.group(1)) if match else None

    def _extract_timestamp(self, text: str) -> Optional[str]:
        """Extract timestamp using multiple format patterns."""
        timestamp_patterns = [
            r'Time\s*[:]\s*(\d{2}-\d{2}-\d{4}\s*\d{2}:\d{2}(?:\s*[APM]{2})?)',
            r'Time\s*[:]\s*(\d{1,2}\s+\w+\s+\d{4}\s*\d{1,2}:\d{2}\s*[APM]{2})'
        ]
        
        for pattern in timestamp_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return self._parse_timestamp(match.group(1))
        
        return None

    def _extract_other_details(self, text: str) -> Optional[str]:
        """Extract other miscellaneous details."""
        # Remove known key fields
        other_details = re.sub(
            r'(Latitude.*?|Longitude.*?|Elevation.*?|Accuracy.*?|Farmer\s*(?:Id|I\'d).*?|' + 
            r'Farmer\s*Name.*?|(?:Crop|Plant).*?|Sapling.*?|Time.*?|Powered\s*by.*)', 
            '', text, 
            flags=re.IGNORECASE
        ).strip()
        
        return other_details if other_details else None

# Usage example
def extract_ocr_details(text):
    """
    Extract details from multiple OCR texts
    
    Args:
        texts (list): List of OCR texts to process
    
    Returns:
        List of extracted details
    """
    extractor = OCRTextExtractor()
    return extractor.extract_details(text) 


# Load environment variables
load_dotenv()
subscription_key = os.getenv('subscription_key')
endpoint = os.getenv('endpoint')

# Azure Computer Vision Client
computervision_client = ComputerVisionClient(endpoint, CognitiveServicesCredentials(subscription_key))

# Azure OCR Function
def azure_ocr_extract(image_file):
    try:
        # Azure OCR Read operation
        read_response = computervision_client.read_in_stream(image_file, raw=True)

        # Get operation ID
        operation_location = read_response.headers["Operation-Location"]
        operation_id = operation_location.split("/")[-1]

        # Polling for operation completion
        while True:
            read_result = computervision_client.get_read_result(operation_id)
            if read_result.status not in [OperationStatusCodes.running, OperationStatusCodes.not_started]:
                break
            time.sleep(1)

                # Extract text line by line
        if read_result.status == OperationStatusCodes.succeeded:
            extracted_lines = []
            for page in read_result.analyze_result.read_results:
                # Collect lines separately
                page_lines = [line.text for line in page.lines]
                extracted_lines.extend(page_lines)
            
            # Join lines with newline character to preserve structure
            return "\n".join(extracted_lines)
        else:
            print("Failed to read text from the image.")
            return None
    except Exception as e:
        print(f"Azure OCR Error: {str(e)}")
        return ""

