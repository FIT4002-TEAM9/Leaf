import os

from src.clients import FirestoreClient
from src.clients import PostgresClient
from src.clients import GDriveClient
from src.utils import FileUtils


class EtlController:
    """
    Orchestrates the OMOP ETL (Extract, Transform, Load) process using Firestore, PostgreSQL, and Google Drive.

    Attributes:
        firestore_client (FirestoreClient): The client for interacting with Firestore.
        postgres_client (PostgresClient): The client for interacting with PostgreSQL.
        gdrive_client (GDriveClient): The client for interacting with Google Drive.
    """

    def __init__(self):
        """
        Initializes the EtlController with the necessary clients.
        """
        self.firestore_client = FirestoreClient.FirestoreClient("auth/firestore_secret.json")
        self.postgres_client = PostgresClient.PostgresClient("leaf-etl", "admin", "password")
        self.gdrive_client = GDriveClient.GDriveClient("auth/service_account_secret.json")

    def trigger_process(self, report_name, password):
        """
        Triggers the standard OMOP ETL process.

        Args:
            report_name (str): The name of the report to generate.
            password (str): The password for the zipped report file.

        Returns:
            str: The ID of the uploaded file on Google Drive.
        """
        print("Beginning EXTRACT Stage")
        self.__extract()
        print("EXTRACT Stage Completed")

        print("Beginning TRANSFORM Stage")
        self.__transform()
        print("TRANSFORM Stage Completed")

        print("Beginning LOAD Stage")
        fileId = self.__load(report_name, password)
        print("LOAD Stage Completed")

        return fileId

    def __extract(self):
        """
        The Extract step of the ETL process. Reads in Nosql data from Firestore and stores it in Postgres so that
        transformations can be performed
        """
        # Connect to Postgres & reset the tables
        self.postgres_client.connect()
        self.postgres_client.reset_etl_tables()

        # Providers Table - Requires Workers Collection
        workers_collection = self.firestore_client.get_all_documents("workers")
        self.postgres_client.insert_providers(workers_collection)

        # Patients, Triage Cases & Events Tables - Requires Patients Collection
        patients_collection = self.firestore_client.get_all_documents("patients")
        self.postgres_client.insert_patients(patients_collection)
        self.postgres_client.insert_triage_cases(patients_collection)
        self.postgres_client.insert_events(patients_collection)
        self.postgres_client.close()

    def __transform(self):
        """
        The Transform step of the ETL process. Performs pre-determined transformations on the data stored in Firestore
        to convert it so that it is compliant with the OMOP schema.
        """
        self.postgres_client.connect()
        sql_directory = 'postgres/transformations'

        # Iterate over OMOP transformation scripts, read in SQL commands and execute them
        for file in sorted(os.listdir(sql_directory)):
            filename = os.fsdecode(file)
            if filename.endswith('.sql'):
                print(f"TRANSFORM: Running {sql_directory}/{filename}")
                fd = open(sql_directory + '/' + filename, 'r')
                sqlFile = fd.read()
                fd.close()
                sqlCommands = sqlFile.split(';')

                for command in sqlCommands:
                    if command:
                        self.postgres_client.execute_query(command)

        self.postgres_client.close()

    def __load(self, report_name, password):
        """
        The Load step of the ETL process. The transformed OMOP data is loaded from Postgres into CSV files. These files
        are then zipped and uploaded back to Google Drive. A file record is also stored in Firestore.

        Args:
            report_name (str): The name of the report to generate.
            password (str): The password for the zipped report file.

        Returns:
            str: The ID of the uploaded file on Google Drive.
        """
        print("Generating CSV's")
        FileUtils.convertOmopTablesToCsv(self.postgres_client, report_name)
        print("Successfully generated CSV's")

        print("Zipping output report")
        FileUtils.createZippedOmopReport(report_name, password)
        print("Zipped output report")

        print("Uploading zipped report to Google Drive")
        fileId = self.gdrive_client.uploadFile(f'{report_name}.zip')
        print("Uploaded file to Google Drive")

        return fileId

    def upload(self, file, filename):
        """
        Uploads a Leaf Quick Report to Google Drive.

        Args:
            file (io.BytesIO): The data to upload.
            filename (str): The name to upload the file with.

        Returns:
            str: The ID of the uploaded file on Google Drive.
        """
        return self.gdrive_client.quickUpload(file, filename)
