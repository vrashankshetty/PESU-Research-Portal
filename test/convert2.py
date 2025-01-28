#!/usr/bin/env python3
import pandas as pd
import os
import sys
from pathlib import Path

def excel_to_csv(excel_file_path, output_dir=None):
    """
    Convert each sheet of an Excel file to a separate CSV file.
    
    Args:
        excel_file_path (str): Path to the Excel file
        output_dir (str, optional): Directory to save CSV files. If None, uses same directory as Excel file
    
    Returns:
        list: List of paths to created CSV files
    """
    try:
        # Validate input file exists
        if not os.path.exists(excel_file_path):
            raise FileNotFoundError(f"Excel file not found: {excel_file_path}")
        
        # Set up output directory
        if output_dir is None:
            output_dir = os.path.dirname(os.path.abspath(excel_file_path))
        else:
            os.makedirs(output_dir, exist_ok=True)
            
        # Get the base filename without extension
        base_filename = Path(excel_file_path).stem
        
        # Read Excel file
        excel_file = pd.ExcelFile(excel_file_path)
        created_files = []
        
        # Convert each sheet to CSV
        for sheet_name in excel_file.sheet_names:
            # Read the sheet
            df = pd.read_excel(excel_file, sheet_name=sheet_name)
            
            # Create CSV filename
            safe_sheet_name = "".join(c if c.isalnum() else "_" for c in sheet_name)
            csv_filename = f"{base_filename}_{safe_sheet_name}.csv"
            csv_path = os.path.join(output_dir, csv_filename)
            
            # Save to CSV
            df.to_csv(csv_path, index=False)
            created_files.append(csv_path)
            
            print(f"Created CSV file: {csv_path}")
            
        return created_files
            
    except Exception as e:
        print(f"Error converting Excel to CSV: {str(e)}")
        return []

def main():
    if len(sys.argv) < 2:
        print("Usage: python excel_to_csv.py <excel_file_path> [output_directory]")
        sys.exit(1)
        
    excel_file = sys.argv[1]
    output_dir = sys.argv[2] if len(sys.argv) > 2 else None
    
    created_files = excel_to_csv(excel_file, output_dir)
    
    if created_files:
        print("\nConversion completed successfully!")
        print(f"Number of CSV files created: {len(created_files)}")
    else:
        print("\nConversion failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()