import unittest
from unittest.mock import patch, MagicMock
from src.clients import FirestoreClient, PostgresClient, GDriveClient
from src.utils import FileUtils
from src.controllers import EtlController
import io


class TestEtlController(unittest.TestCase):
    """
    Unit tests for the EtlController class.
    """

    @patch('src.clients.FirestoreClient.FirestoreClient')
    @patch('src.clients.PostgresClient.PostgresClient')
    @patch('src.clients.GDriveClient.GDriveClient')
    def setUp(self, MockFirestoreClient, MockPostgresClient, MockGDriveClient):
        """
        Set up the test environment before each test.

        Mocks the FirestoreClient, PostgresClient, and GDriveClient.
        """
        self.mock_firestore_client = MockFirestoreClient.return_value
        self.mock_postgres_client = MockPostgresClient.return_value
        self.mock_gdrive_client = MockGDriveClient.return_value

        self.target = EtlController.EtlController()

    @patch('src.controllers.EtlController.FileUtils')
    def test_trigger_process(self, MockFileUtils):
        """
        Test the trigger_process method to ensure it calls the extract, transform, and load methods.
        """
        # Mock the private methods of EtlController
        self.target._EtlController__extract = MagicMock()
        self.target._EtlController__transform = MagicMock()
        self.target._EtlController__load = MagicMock(return_value='fake_file_id')

        # Call the method to test
        file_id = self.target.trigger_process('test_report', 'test_password')

        # Check that the extract, transform, and load methods were called
        self.target._EtlController__extract.assert_called_once()
        self.target._EtlController__transform.assert_called_once()
        self.target._EtlController__load.assert_called_once_with('test_report', 'test_password')
        self.assertEqual(file_id, 'fake_file_id')

    def test_extract(self):
        """
        Test the private __extract method to ensure it retrieves and processes data correctly.
        """
        # Mock data returned by FirestoreClient
        workers_collection = [{'id': '1', 'firstName': 'John', 'lastName': 'Doe', 'email': 'john.doe@example.com',
                               'currentHospitalId': '123'}]
        patients_collection = [
            {'mrn': '123-456', 'firstName': 'Jane', 'lastName': 'Doe', 'dob': '1990-01-01', 'phoneNumber': '1234567890',
             'postCode': '12345', 'sex': 'F', 'timeLastAllocated': '2023-01-01', 'idAllocatedTo': '1',
             'triageCase': {'hospitalId': '123'}, 'events': [
                {'id': '1', 'title': 'Event1', 'description': 'Description1', 'category': 'Category1',
                 'createdAt': '2023-01-01', 'lastCompleted': '2023-01-02', 'triggerTime': '2023-01-03'}]}]

        self.mock_firestore_client.get_all_documents.side_effect = [workers_collection, patients_collection]

        # Call the method to test
        self.target._EtlController__extract()

        # Check that the PostgresClient methods were called correctly
        self.mock_postgres_client.connect.assert_called_once()
        self.mock_postgres_client.reset_etl_tables.assert_called_once()
        self.mock_postgres_client.insert_providers.assert_called_once()
        self.mock_postgres_client.insert_patients.assert_called_once()
        self.mock_postgres_client.insert_triage_cases.assert_called_once()
        self.mock_postgres_client.insert_events.assert_called_once()
        self.mock_postgres_client.close.assert_called_once()

    @patch('os.listdir', return_value=['transform1.sql', 'transform2.sql'])
    @patch('builtins.open', new_callable=unittest.mock.mock_open, read_data='SQL_COMMAND;')
    def test_transform(self, mock_open, mock_listdir):
        """
        Test the private __transform method to ensure it executes SQL transformation scripts.

        Mocks os.listdir to simulate SQL script files and open to simulate reading SQL commands.
        """
        # Call the method to test
        self.target._EtlController__transform()

        # Check that the PostgresClient methods were called correctly
        self.mock_postgres_client.connect.assert_called_once()
        self.mock_postgres_client.execute_query.assert_any_call('SQL_COMMAND')
        self.mock_postgres_client.close.assert_called_once()

    @patch('src.controllers.EtlController.FileUtils')
    def test_load(self, MockFileUtils):
        """
        Test the private __load method to ensure it converts tables to CSV and creates a zipped report.

        Mocks FileUtils methods to simulate file operations.
        """
        # Mock the FileUtils methods
        MockFileUtils.convertOmopTablesToCsv = MagicMock()
        MockFileUtils.createZippedOmopReport = MagicMock()
        self.mock_gdrive_client.uploadFile = MagicMock(return_value='fake_file_id')

        # Call the method to test
        file_id = self.target._EtlController__load('test_report', 'test_password')

        # Check that the FileUtils methods were called correctly
        MockFileUtils.convertOmopTablesToCsv.assert_called_once_with(self.mock_postgres_client, 'test_report')
        MockFileUtils.createZippedOmopReport.assert_called_once_with('test_report', 'test_password')

    def test_upload(self):
        """
        Test the upload method to ensure it uploads a file to Google Drive.
        """
        # Mock the GDriveClient method
        self.mock_gdrive_client.quickUpload = MagicMock(return_value='fake_file_id')

        # Call the method to test
        file_id = self.target.upload(io.BytesIO(b"fake file content"), 'test_file.zip')
