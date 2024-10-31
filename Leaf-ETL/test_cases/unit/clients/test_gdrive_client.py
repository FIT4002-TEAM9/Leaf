import unittest
from unittest.mock import patch, MagicMock
from src.clients.GDriveClient import GDriveClient
from googleapiclient.http import MediaIoBaseDownload, MediaFileUpload, MediaDownloadProgress
import io


class TestGDriveClient(unittest.TestCase):
    """
    Unit tests for the GDriveClient class.
    """

    @patch('src.clients.GDriveClient.build')
    @patch('src.clients.GDriveClient.service_account.Credentials')
    def setUp(self, MockCredentials, MockBuild):
        """
        Set up the test environment before each test.

        Mocks the service account credentials and Google Drive service.
        """
        self.mock_credentials = MockCredentials.from_service_account_file.return_value
        self.mock_drive_service = MockBuild.return_value

        self.target = GDriveClient('fake_client_secret.json')

    def test_downloadFile(self):
        """
        Test the downloadFile method to ensure it downloads a file from Google Drive.

        Mocks the file metadata retrieval and download process.
        """
        # Mock the file metadata and download process
        mock_files = MagicMock()
        mock_files.list.return_value.execute.return_value = {
            'files': [{'id': 'fake_file_id'}]
        }
        self.target.client.files.return_value = mock_files

        mock_request = MagicMock()
        self.target.client.files().get_media.return_value = mock_request

        mock_downloader = MagicMock()
        with patch('src.clients.GDriveClient.MediaIoBaseDownload', return_value=mock_downloader):
            mock_downloader.next_chunk.side_effect = [
                (MagicMock(progress=MediaDownloadProgress(5, 10)), False),
                (MagicMock(progress=MediaDownloadProgress(10, 10)), True)
            ]

            with patch('builtins.open', new_callable=unittest.mock.mock_open()) as mock_file:
                self.target.downloadFile('test_file.txt')

                # Verify the interactions
                mock_files.list.assert_called_once_with(
                    fields="nextPageToken, files(id, name, mimeType, size, modifiedTime)",
                    q="name = 'test_file.txt'"
                )
                self.target.client.files().get_media.assert_called_once_with(fileId='fake_file_id')
                mock_downloader.next_chunk.assert_any_call()
                mock_file.assert_called_once_with('test_file.txt', 'wb')

    def test_uploadFile(self):
        """
        Test the uploadFile method to ensure it uploads a file to Google Drive.

        Mocks the file upload process.
        """
        mock_files = MagicMock()
        self.target.client.files.return_value = mock_files

        mock_files.create.return_value.execute.return_value = {'id': 'fake_file_id'}

        with patch('src.clients.GDriveClient.MediaFileUpload', return_value=MagicMock()):
            file_id = self.target.uploadFile('test_file.csv')

            # Verify the interactions
            mock_files.create.assert_called_once()
            self.assertEqual(file_id, 'fake_file_id')

    def test_quickUpload(self):
        """
        Test the quickUpload method to ensure it uploads a file stream to Google Drive.

        Mocks the file upload process.
        """
        mock_files = MagicMock()
        self.target.client.files.return_value = mock_files

        mock_files.create.return_value.execute.return_value = {'id': 'fake_file_id'}

        with patch('src.clients.GDriveClient.MediaIoBaseUpload', return_value=MagicMock()):
            file_stream = io.BytesIO(b"fake file content")
            file_id = self.target.quickUpload(file_stream, 'test_file.zip')

            # Verify the interactions
            mock_files.create.assert_called_once()
            self.assertEqual(file_id, 'fake_file_id')

    def test_quickDownload(self):
        """
        Test the quickDownload method to ensure it downloads a file stream from Google Drive.

        Mocks the file download process.
        """
        mock_files = MagicMock()
        self.target.client.files.return_value = mock_files

        mock_request = MagicMock()
        self.target.client.files().get_media.return_value = mock_request

        mock_downloader = MagicMock()
        with patch('src.clients.GDriveClient.MediaIoBaseDownload', return_value=mock_downloader):
            mock_downloader.next_chunk.side_effect = [
                (MagicMock(progress=MediaDownloadProgress(5, 10)), False),
                (MagicMock(progress=MediaDownloadProgress(10, 10)), True)
            ]

            file_stream = self.target.quickDownload('fake_file_id', 'output_file.zip')

            # Verify the interactions
            self.target.client.files().get_media.assert_called_once_with(fileId='fake_file_id')
            mock_downloader.next_chunk.assert_any_call()
            self.assertIsInstance(file_stream, io.BytesIO)


if __name__ == '__main__':
    unittest.main()
