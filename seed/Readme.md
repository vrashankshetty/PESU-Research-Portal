
## Description

This project is a Python script that performs a specific task.

## Usage

1. Run the script using the following command:

    ```shell
    python <python_file_name> <path_to_excel> <api_url>
    ```

    Replace `<python_file_name>` with the name of the Python file you want to execute.

    Replace `<path_to_excel>` with the path to the Excel file you want to use as input.

    Replace `<api_url>` with the URL of the API endpoint you want to send the data to.

Example: 

    ```shell
    python default_users.py ./default_users.xlsx http://localhost:5500/api/v1/auth/register
    ```
2. The script will process the data from the Excel file and send it to the specified API endpoint.

3. Check the console output for any error messages or success notifications.

