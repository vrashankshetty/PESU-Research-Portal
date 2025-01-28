import sys
import os
import pandas as pd
import requests
from datetime import datetime
import numpy as np
import json


if len(sys.argv) != 3:
    print("Usage: python seed.py <path_to_excel_file> <api_url>")
    sys.exit(1)

excel_file = sys.argv[1]
api_url = sys.argv[2]


data_list = [
    {
        "name": "Dr. Suja C M",
        "teacherIds": [],
        "patentNumber": "409651-001",
        "patentTitle": "FRUIT PICKER",
        "year": "2024",
        "documentLink": "https://drive.google.com/file/d/1MaY6AQ6vh7p8pmanTolToPGuws2gzt8d/view?usp=sharing",
    },
    {
        "name": "Deepti Chandrasekharan",
        "teacherIds": [],
        "patentNumber": "541176",
        "patentTitle": "A SHOPPING TROLLEY WITH AUTOMATIC BILLING SYSTEM",
        "year": "2024",
        "documentLink": "https://drive.google.com/file/d/1Tb7WSI9FlOwnI_-OHWzt_ozehGOW367/view?usp=sharing",
    },
    {
        "name": "Surbhi Choudhary",
        "teacherIds": [],
        "patentNumber": "415054-001",
        "patentTitle": "SMART SHOPPING TROLLEY",
        "year": "2024",
        "documentLink": "https://drive.google.com/file/d/1Opay89z407r4Ssng_V03thjVBdKH0-N/view",
    },
    {
        "name": "Dr. Prajwala Ranganath talanki",
        "teacherIds": ["Dr. Chandrashekhar Pomu Chavan"],
        "patentNumber": "556591",
        "patentTitle": "Connectionless Vending Machine Using Encrypted QR Code",
        "year": "2024",
        "documentLink": "https://drive.google.com/drive/folders/1_stZF7BRiVNVvRG-OBHzeiMfgLJlS2peGu?usp=sharing",
    },
    {
        "name": "Dr. Suja C M",
        "teacherIds": ["Dr. Vaishali Dasharath Shinde"],
        "patentNumber": "6407605",
        "patentTitle": "AI-based computer for a holistic data governance framework",
        "year": "2024",
        "documentLink": "https://drive.google.com/file/d/1NGF4p3XQISJ6hEyL_rpjXz08yLBhpd/view?usp=sharing",
    },
    {
        "name": "Dr. L Kamatchi Priya",
        "teacherIds": [
            "J Ruby Dinakar",
            "Divya Ebenezer Nathaniel"
        ],
        "patentNumber": "224414",
        "patentTitle": "IoT Disaster Prediction Device",
        "year": "2024",
        "documentLink": "https://drive.google.com/file/d/1NGF4p3XQISJ6hEyL_rpjXz08yLBhpd/view?usp=sharing",
    }
]



print("Started seeding patent data...")

for record in data_list:
    try:
        # Use custom JSON dumps to handle serialization
        response = requests.post(
            api_url, 
            data=json.dumps(record),
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 201:
            print(f"successfully.")
        else:
            print(f"Failed : {response.text}")
    except Exception as e:
        print(f"Error: {e}")
        
        
        