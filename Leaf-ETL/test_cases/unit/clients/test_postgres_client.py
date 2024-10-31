import unittest
from unittest.mock import patch, mock_open, MagicMock
from src.exceptions.DatabaseError import DatabaseError
from src.clients.PostgresClient import PostgresClient


class TestPostgresClient(unittest.TestCase):
    """
    Unit tests for the PostgresClient class.
    """

    def setUp(self):
        """
        Set up the test environment before each test.

        Initializes a PostgresClient instance with test parameters.
        """
        self.client = PostgresClient(dbname="testdb", user="testuser", password="testpass")

    @patch('psycopg2.connect')
    def test_connect_success(self, mock_connect):
        """
        Test successful connection to the PostgreSQL database.

        Mocks psycopg2.connect to simulate a successful database connection.
        """
        mock_connect.return_value = MagicMock()
        self.client.connect()
        mock_connect.assert_called_once_with(
            dbname="testdb",
            user="testuser",
            password="testpass",
            host='localhost',
            port=5432
        )
        self.assertIsNotNone(self.client.connection)

    @patch('psycopg2.connect', side_effect=Exception('Connection error'))
    def test_connect_failure(self, mock_connect):
        """
        Test failed connection to the PostgreSQL database.

        Mocks psycopg2.connect to simulate a connection error and checks that a DatabaseError is raised.
        """
        with self.assertRaises(DatabaseError):
            self.client.connect()

    def test_close_connection(self):
        """
        Test closing the database connection.

        Ensures that the connection's close method is called.
        """
        self.client.connection = MagicMock()
        self.client.close()
        self.client.connection.close.assert_called_once()

    def test_close_without_connection(self):
        """
        Test closing the database connection when no connection exists.

        Ensures that no error is raised when attempting to close a non-existent connection.
        """
        self.client.connection = None
        self.client.close()  # Should not raise any error

    @patch.object(PostgresClient, 'execute_query')
    def test_reset_etl_tables(self, mock_execute_query):
        """
        Test resetting ETL tables.

        Mocks the execute_query method to ensure the correct SQL command is executed.
        """
        self.client.connection = MagicMock()
        self.client.reset_etl_tables()
        mock_execute_query.assert_called_once_with(
            "TRUNCATE omop_person, omop_observation_period, omop_location, omop_care_site,"
            "omop_provider, omop_drug_exposure, triage_case, events, omop_episode, omop_measurement,"
            "omop_procedure_occurrence, omop_condition_occurrence, omop_visit_occurrence,"
            "omop_device_exposure, omop_observation, patient;"
        )

    @patch.object(PostgresClient, 'execute_query')
    def test_insert_providers(self, mock_execute_query):
        """
        Test inserting providers into the database.

        Mocks the execute_query method to ensure the correct SQL command is executed.
        """
        self.client.connection = MagicMock()
        workers = [
            {'id': '1', 'firstName': 'John', 'lastName': 'Doe', 'email': 'john.doe@example.com',
             'currentHospitalId': 'H001'}
        ]
        self.client.insert_providers(workers)
        mock_execute_query.assert_called_once()
        query = """
        INSERT INTO
            provider (id, first_name, last_name, email, hospital_id)
        VALUES 
        ('1', 'John', 'Doe', 'john.doe@example.com', 'H001');
        """
        self.assertIn(query.strip(), mock_execute_query.call_args[0][0])

    @patch.object(PostgresClient, 'execute_query')
    def test_insert_patients(self, mock_execute_query):
        """
        Test inserting patients into the database.

        Mocks the execute_query method to ensure the correct SQL command is executed.
        """
        self.client.connection = MagicMock()
        patients = [
            {
                'mrn': '123-456', 'firstName': 'Jane', 'lastName': 'Doe', 'dob': '1990-01-01',
                'phoneNumber': '123456789', 'postCode': '12345', 'sex': 'F', 'timeLastAllocated': '2024-01-01T12:00:00',
                'idAllocatedTo': 'P001', 'triageCase': {'hospitalId': 'H002'}
            }
        ]
        self.client.insert_patients(patients)
        mock_execute_query.assert_called_once()
        query = """
        INSERT INTO
            patient (mrn, first_name, last_name, date_of_birth, phone_number, post_code, sex, time_last_allocated, provider_id, hospital_id) 
        VALUES 
        ('123456', 'Jane', 'Doe', '1990-01-01', '123456789', '12345', 'F', '2024-01-01T12:00:00', 'P001', 'H002');
        """
        self.assertIn(query.strip(), mock_execute_query.call_args[0][0])

    @patch.object(PostgresClient, 'execute_query')
    def test_insert_triage_cases(self, mock_execute_query):
        """
        Test inserting triage cases into the database.

        Mocks the execute_query method to ensure the correct SQL command is executed.
        """
        self.client.connection = MagicMock()
        patients = [
            {
                'mrn': '123-456', 'triageCase': {
                'id': 'T001', 'triageCode': 'A', 'triageText': 'Critical',
                'arrivalDate': '2024-01-01', 'arrivalWardId': 'W001', 'hospitalId': 'H001', 'medicalUnitId': 'M001'
            }
            }
        ]
        self.client.insert_triage_cases(patients)
        mock_execute_query.assert_called_once()
        query = """
        INSERT INTO
            triage_case (id, triage_code, triage_text, patient_id, arrival_date, arrival_ward_id, hospital_id, medical_unit_id) 
        VALUES 
        ('T001', 'A', 'Critical', '123456', '2024-01-01', 'W001', 'H001', 'M001');
        """
        self.assertIn(query.strip(), mock_execute_query.call_args[0][0])

    @patch.object(PostgresClient, 'execute_query')
    def test_insert_events(self, mock_execute_query):
        """
        Test inserting events into the database.

        Mocks the execute_query method to ensure the correct SQL command is executed.
        """
        self.client.connection = MagicMock()
        patients = [
            {
                'mrn': '123-456', 'events': [
                {'id': 'E001', 'title': 'Checkup', 'description': 'Routine checkup', 'category': 'Medical',
                 'createdAt': '2024-01-01', 'lastCompleted': '2024-01-02', 'triggerTime': '2024-01-03'}
            ]
            }
        ]
        self.client.insert_events(patients)
        mock_execute_query.assert_called_once()
        query = """
        INSERT INTO
            events (id, patient_id, title, description, category, created_at, last_completed, trigger_time) 
        VALUES 
        ('E001', '123456', 'Checkup', 'Routine checkup', 'Medical', '2024-01-01', '2024-01-02', '2024-01-03');
        """
        self.assertIn(query.strip(), mock_execute_query.call_args[0][0])

    @patch.object(PostgresClient, 'read_table')
    @patch('csv.writer')
    @patch('os.mkdir')
    @patch('os.path.exists', return_value=False)
    @patch('builtins.open', new_callable=mock_open)
    def test_read_table_into_csv(self, mock_open_func, mock_exists, mock_mkdir, mock_csv_writer, mock_read_table):
        """
        Test reading a table into a CSV file.

        Mocks the read_table method to simulate database interaction and csv.writer to simulate file writing.
        """
        mock_read_table.return_value = ([('row1', 'data1')], ['column1', 'column2'])

        self.client.connection = MagicMock()

        # Call the method to test
        self.client.read_table_into_csv('test_table', '/test_directory/')

        # Check that the directory was created
        mock_mkdir.assert_called_once_with('/test_directory/')

        # Check that the file was opened correctly
        mock_open_func.assert_called_once_with('/test_directory/test_table.csv', mode='w', newline='')

        # Check that csv.writer was called to write the data
        mock_csv_writer().writerow.assert_called_once_with(['column1', 'column2'])
        mock_csv_writer().writerows.assert_called_once_with([('row1', 'data1')])
