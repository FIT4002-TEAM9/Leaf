import unittest
from unittest.mock import patch, MagicMock, mock_open
import os
import pyzipper
from src.utils import FileUtils


class TestFileUtils(unittest.TestCase):
    """
    Unit tests for the FileUtils class.
    """

    @patch('os.walk')
    @patch('pyzipper.AESZipFile')
    def test_createZippedOmopReport(self, MockAESZipFile, mock_os_walk):
        """
        Test the createZippedOmopReport function to ensure it correctly zips files with AES encryption.

        Mocks os.walk to simulate directory structure and pyzipper.AESZipFile to simulate zip file creation.
        """
        # Mock the return value of AESZipFile
        mock_zip_file = MockAESZipFile.return_value

        # Mock the directory structure returned by os.walk
        mock_os_walk.return_value = [
            ('./test_directory', ['folder1'], ['file1.txt', 'file2.txt']),
            ('./test_directory/folder1', [], ['file3.txt'])
        ]

        # Call the function to test
        FileUtils.createZippedOmopReport('test_directory', 'test_password')

        # Check that AESZipFile was called with the correct parameters
        MockAESZipFile.assert_called_once_with('test_directory.zip', 'w', compression=pyzipper.ZIP_DEFLATED,
                                               encryption=pyzipper.WZ_AES)

        # Check that the password was set correctly
        mock_zip_file.pwd = 'test_password'

        # Check that the correct files were added to the zip
        mock_zip_file.write.assert_any_call('./test_directory/file1.txt', './test_directory/file1.txt')
        mock_zip_file.write.assert_any_call('./test_directory/file2.txt', './test_directory/file2.txt')

        # Check that the zip file was closed
        mock_zip_file.close.assert_called_once()

    @patch('src.clients.PostgresClient')
    def test_convertOmopTablesToCsv(self, MockPostgresClient):
        """
        Test the convertOmopTablesToCsv function to ensure it correctly converts OMOP tables to CSV files.

        Mocks the PostgresClient to simulate database interactions.
        """
        # Mock the PostgresClient instance
        mock_db = MockPostgresClient.return_value

        # Call the function to test
        FileUtils.convertOmopTablesToCsv(mock_db, 'test_report')

        # Check that the database connection was established
        mock_db.connect.assert_called_once()

        # List of OMOP tables to be converted
        tables = [
            'omop_person', 'omop_location', 'omop_care_site', 'omop_provider', 'omop_observation_period',
            'omop_drug_exposure', 'omop_device_exposure', 'omop_visit_occurrence', 'omop_condition_occurrence',
            'omop_procedure_occurrence', 'omop_measurement', 'omop_observation', 'omop_episode', 'omop_note'
        ]

        # Check that each table was read into a CSV file
        for table in tables:
            mock_db.read_table_into_csv.assert_any_call(table, f'./test_report/')

        # Check that the database connection was closed
        mock_db.close.assert_called_once()
