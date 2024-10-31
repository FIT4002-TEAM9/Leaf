import csv
import os

import psycopg2

from src.exceptions.DatabaseError import DatabaseError


class PostgresClient:
    """
    A wrapper around the psycopg2 PostgreSQL client.

    Attributes:
        dbname (str): The name of the database.
        user (str): The username for the database.
        password (str): The password for the database.
        host (str): The host address of the database.
        port (int): The port number for the database.
        connection (psycopg2.extensions.connection): The connection object to the PostgreSQL database.
    """

    def __init__(self, dbname, user, password, host='localhost', port=5432):
        """
        Initializes the PostgresClient with the given database credentials.

        Args:
            dbname (str): The name of the database.
            user (str): The username for the database.
            password (str): The password for the database.
            host (str, optional): The host address of the database. Defaults to 'localhost'.
            port (int, optional): The port number for the database. Defaults to 5432.
        """
        self.dbname = dbname
        self.user = user
        self.password = password
        self.host = host
        self.port = port
        self.connection = None

    def connect(self):
        """
        Establishes a connection to the PostgreSQL database.

        Raises:
            DatabaseError: If there is an error connecting to the database.
        """
        try:
            self.connection = psycopg2.connect(
                dbname=self.dbname,
                user=self.user,
                password=self.password,
                host=self.host,
                port=self.port
            )
            print("Connection to PostgreSQL DB successful")
        except Exception as e:
            raise DatabaseError("Error connecting to PostgreSQL DB", e)

    def close(self):
        """
        Closes the connection to the PostgreSQL database.
        """
        if self.connection:
            self.connection.close()
            print("Connection closed")

    def reset_etl_tables(self):
        """
        Resets the ETL tables by truncating the specified tables.
        """
        self.check_connection()
        self.execute_query("TRUNCATE omop_person, omop_observation_period, omop_location, omop_care_site,"
                           "omop_provider, omop_drug_exposure, triage_case, events, omop_episode, omop_measurement,"
                           "omop_procedure_occurrence, omop_condition_occurrence, omop_visit_occurrence,"
                           "omop_device_exposure, omop_observation, omop_note, patient, provider;")

    def insert_providers(self, workers):
        """
        Inserts multiple provider records into the database.

        Args:
            workers (list): A list of dictionaries, each representing a provider.
        """
        self.check_connection()

        query = """
        INSERT INTO
            provider (id, first_name, last_name, email, hospital_id)
        VALUES 
        """

        for worker in workers:
            query += f"('{worker['id']}', '{worker['firstName']}', '{worker['lastName']}', '{worker['email']}', '{worker['currentHospitalId']}'),\n"
        query = query[:-2] + ";"

        self.execute_query(query)

    def insert_patients(self, patients):
        """
        Inserts multiple patient records into the database.

        Args:
            patients (list): A list of dictionaries, each representing a patient.
        """
        self.check_connection()

        query = """
        INSERT INTO
            patient (mrn, first_name, last_name, date_of_birth, phone_number, post_code, sex, time_last_allocated, provider_id, hospital_id) 
        VALUES 
        """

        for patient in patients:
            query += f"('{patient['mrn'].replace('-', '')}', '{patient['firstName']}', '{patient['lastName']}', '{patient['dob']}', '{patient['phoneNumber']}', '{patient['postCode']}', '{patient['sex']}', '{patient['timeLastAllocated']}', '{patient['idAllocatedTo']}', '{patient['triageCase']['hospitalId']}'),\n"
        query = query[:-2] + ";"

        self.execute_query(query)

    def insert_triage_cases(self, patients):
        """
        Inserts multiple triage case records into the database.

        Args:
            patients (list): A list of dictionaries, each representing a patient with triage case details.
        """
        self.check_connection()

        # Add nullable Discharge Date and Discharge Ward
        query = """
        INSERT INTO
            triage_case (id, triage_code, triage_text, patient_id, arrival_date, arrival_ward_id, hospital_id, medical_unit_id) 
        VALUES 
        """

        for patient in patients:
            triage = patient["triageCase"]
            query += f"('{triage['id']}', '{triage['triageCode']}', '{triage['triageText']}', '{patient['mrn'].replace('-', '')}', '{triage['arrivalDate']}', '{triage['arrivalWardId']}', '{triage['hospitalId']}', '{triage['medicalUnitId']}'),\n"
        query = query[:-2] + ";"

        self.execute_query(query)

    def insert_events(self, patients):
        """
        Inserts multiple event records into the database.

        Args:
            patients (list): A list of dictionaries, each representing a patient with event details.
        """
        self.check_connection()

        query = """
        INSERT INTO
            events (id, patient_id, title, description, category, created_at, last_completed, trigger_time) 
        VALUES 
        """

        for patient in patients:
            events = patient["events"]
            for event in events:
                query += f"('{event['id']}', '{patient['mrn'].replace('-', '')}', '{event['title']}', '{event['description']}', '{event['category'].replace(' ', '_')}', '{event['createdAt']}', '{event['lastCompleted']}', '{event['triggerTime']}'),\n"
        query = query[:-2] + ";"

        self.execute_query(query)

    def read_table_into_csv(self, table_name, directory):
        """
        Reads data from a specified table and writes it to a CSV file.

        Args:
            table_name (str): The name of the table to read from.
            directory (str): The directory where the CSV file will be saved.
        """
        if not os.path.exists(directory):
            os.mkdir(directory)
            print(f"Created {directory} path for OMOP CSV's")

        data, column_names = self.read_table(table_name)

        if data:
            # Write data to CSV
            with open(directory + table_name + '.csv', mode='w', newline='') as file:
                writer = csv.writer(file)
                writer.writerow(column_names)  # Write headers
                writer.writerows(data)  # Write data rows

            print(f"Data from {table_name} has been written to {directory + table_name + '.csv'}")
        else:
            print(f"No data found in table {table_name}")

    def read_table(self, table_name):
        """
        Reads all data from a specified table.

        Args:
            table_name (str): The name of the table to read from.

        Returns:
            tuple: A tuple containing a list of data rows and a list of column names.
        """
        try:
            with self.connection.cursor() as cursor:
                cursor.execute(f"""SELECT * FROM {table_name}""")
                data = []
                for row in cursor.fetchall():
                    data.append(row)
                column_names = [desc[0] for desc in cursor.description]
        except Exception as e:
            raise DatabaseError("Error reading table", e)

        return data, column_names

    def execute_query(self, query):
        """
        Executes a given SQL query.

        Args:
            query (str): The SQL query to execute.

        Raises:
            DatabaseError: If there is an error executing the query.
        """
        try:
            with self.connection.cursor() as cursor:
                cursor.execute(query)
                self.connection.commit()
                print("Query executed successfully")
        except Exception as e:
            raise DatabaseError("Error executing query", e)

    def check_connection(self):
        """
        Checks if the connection to the database is established.

        Raises:
            DatabaseError: If the connection is not established.
        """
        if self.connection is None:
            raise DatabaseError("Connection not established. Call connect() first.")
