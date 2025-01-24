import pandas as pd
import os

def split_xlsx_to_csv(input_file, output_folder, sheet_name="2024 Published or Accepted", rows_per_file=30):
    # Read the specified sheet from the Excel file into a DataFrame
    df = pd.read_excel(input_file, sheet_name=sheet_name)
    
    # Get the total number of rows
    total_rows = len(df)
    num_files = 7
    rows_per_file = total_rows // num_files  # Distribute rows evenly
    
    for i in range(num_files):
        start_idx = i * rows_per_file
        end_idx = start_idx + rows_per_file if i < num_files - 1 else total_rows
        chunk = df.iloc[start_idx:end_idx]

        # Create output file name
        output_file = f"{output_folder}/output_file_{i+1}.csv"
        chunk.to_csv(output_file, index=False)
        print(f"Saved {output_file} with rows {start_idx+1} to {end_idx}.")

# Example usage
input_file = "./input.xlsx"  # Replace with your XLSX file
output_folder = "./output_csv_files"  # Replace with your desired output folder

# Ensure the output folder exists
os.makedirs(output_folder, exist_ok=True)

split_xlsx_to_csv(input_file, output_folder)
