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


if not os.path.isfile(excel_file):
    print(f"Error: File '{excel_file}' not found!")
    sys.exit(1)


# Read Excel file
try:
    data = pd.read_excel(excel_file)
except Exception as e:
    print(f"Error reading Excel file: {e}")
    sys.exit(1)
print(data)
# Transform data
data['empId']=data['empId']
data['name'] = data['name']
data['password'] = data['password']
data['panNo'] = data['panNo']
data['phno'] = data['phno'].fillna('').astype(str)
data['designation'] = data['designation']
data['dept'] = "Computer Science and Engineering"
data['campus'] = data['campus']
data['qualification'] = data['qualification']
data['expertise'] = data['expertise']
data['dateofJoining'] = data['dateofJoining']
data['totalExpBfrJoin'] = data['totalExpBfrJoin']
data['googleScholarId'] = data['googleScholarId']
data['role'] = data['role']
data['accessTo'] = data['accessTo']
data['sId'] = data['sId']
data['oId'] = data['oId']
data['profileImg'] = data['profileImg']

# Select only the required fields
fields = ['empId','name', 'password', 'campus', 'qualification', 'expertise', 'panNo', 'phno', 'designation','dept',
          'dateofJoining', 'totalExpBfrJoin', 'googleScholarId','role','accessTo','sId', 'oId', 'profileImg']

# Create a list of dictionaries with only these fields
data_list = data[fields].to_dict(orient='records')

# Print the resulting list
print(data_list)

# print(data)

# Convert DataFrame to list of dictionaries
# data_dicts = data.to_dict('records')
# print(data_dicts)
# Send data to the API
# Save the transformed data_list to a new CSV file
output_csv = "./transformed_data.csv"

# Convert data_list back to a DataFrame
transformed_data = pd.DataFrame(data_list)

# Write the DataFrame to a CSV file
try:
    transformed_data.to_csv(output_csv, index=False, encoding='utf-8')
    print(f"Transformed data has been written to '{output_csv}' successfully.")
except Exception as e:
    print(f"Error writing data to CSV file: {e}")

for record in data_list:
    try:
        # Use custom JSON dumps to handle serialization
        response = requests.post(
            api_url, 
            data=json.dumps(record),
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 201:
            print(f"User {record['empId']} registered successfully.")
        else:
            print(f"Failed to register user {record['empId']}: {response.text}")
    except Exception as e:
        print(f"Error sending data for user {record['empId']}: {e}")
        
        
        