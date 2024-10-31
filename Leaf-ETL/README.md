# Leaf ETL Processor

The Leaf ETL Processor is a tool designed to convert medical application data in the standardised OMOP format. This is
done using the ETL (Extract, Transform, Load) process. The ETL process is as follows

1. Data is extracted from the application Firestore
2. Data is uploaded into PostgreSQL
3. Transformation scripts are run on PostgreSQL data to convert it into the OMOP format
4. OMOP PostgreSQL data is extracted and placed into CSV files
5. CSV files are zipped up and uploaded to Google Drive
6. File identifier is stored in Firestore to facilitate frontend access

## Table of Contents
- Installation
- Configuration
- Usage
- Running Tests
- OMOP Requirements
- Contributing
- License
- Contact

## Installation
### Leaf ETL
To install the Leaf ETL Processor, clone the repository and install the dependencies:

```bash
git clone https://github.com/FIT4002-Group8/Leaf-V2.git
cd Leaf-V2/Leaf-ETL
pip install -r requirements.txt
```

### psql

To properly set up the local database and copy OMOP concepts in Postgres, you need to install psql. Follow the below
steps based on your operating system and then run the version command to verify that psql is installed.

```bash
psql --version
```

#### psql - MacOS
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" # Install Homebrew
brew install libpq # Install libpq
brew link --force libpq # Symlink libpq to your PATH
```

#### psql - Linux
```bash
sudo apt update # Update your package list
sudo apt install postgresql-client # Install the postgres client
```

#### psql - Windows
1. Download the PostgreSQL installer from the official website
2. When installing, make sure "Command Line Tools" is selected
3. Add the PostgreSQL bin directory to your PATH
   1. Open the Start Search, type in “env”, and select “Edit the system environment variables”. 
   2. In the System Properties window, click on the “Environment Variables” button. 
   3. In the Environment Variables window, find the Path variable in the “System variables” section, and click “Edit”. 
   4. Click “New” and add the path to the PostgreSQL bin directory (e.g., C:\Program Files\PostgreSQL\13\bin).

## Configuration
Configure the application by setting the necessary environment variables or editing the configuration files:

- **Flask Secret Key**: Set the flask secret key to the required environment to get environment variables. Default is 
dev
- **PostgreSQL:** Configured for localhost with the default leaf-etl database in PostgresClient.py
- **Firestore:** From the Firestore admin console, download the admin JSON credential file and save it as
auth/firestore_secret.json
- **Google Drive:** From the Google Cloud Console, navigate to IAM and find service accounts. Download the JSON credential
file from the Leaf-ETL service account and save it as auth/service_account_secret.json

## Usage
Run the following command from the root directory to run the Leaf-ETL app after starting the Postgres database

python3 -m flask --app src/Application.py run

### OMOP Requirements
To run the Postgres database, you need to download the OMOP vocabularies from Athena. The instructions are as follows:

1. Go to Athena https://athena.ohdsi.org/
2. Create an account
3. Go to downloads
4. Download the default bundle
5. Extract it and move the CONCEPTS.csv class in to Leaf-ETL/postgres/vocabularies
6. Run the start_database.sh script to copy the csv file in to Postgres

## API Endpoints
### Trigger ETL Process

```commandline
GET /trigger
```

#### Query Parameters:

- title: The name of the report to generate.
- password: The password for the zipped report file.

### Upload File

```commandline
POST /upload
```

#### Form Data:

- file: The file to upload.
- password: The password for the zipped file. 

### Download File

```commandline
GET /download
```

#### Query Parameters:

- file_title: The title of the file to download.
- report_type: The type of report (e.g., “Full Report”).
- file_id: The ID of the file to download.

## Running Test Cases
Run the test_runner.py file in your IDE, or use the following commands from the root Leaf-ETL directory
```bash
export PYTHONPATH=$(pwd)
pytest
```

To generate a HTML report describing test results, use the following command instead

```bash
pytest --html=report.html
```

Ensure test cases are named test_ and relative imports are used so that the test_runner can pick up the files
