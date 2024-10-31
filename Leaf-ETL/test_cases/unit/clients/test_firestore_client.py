import unittest
from unittest.mock import patch, MagicMock
from src.clients.FirestoreClient import FirestoreClient


class TestFirestoreClient(unittest.TestCase):
    """
    Unit tests for the FirestoreClient class.
    """

    @patch('src.clients.FirestoreClient.firestore.Client')
    @patch('src.clients.FirestoreClient.service_account.Credentials')
    def setUp(self, MockCredentials, MockFirestoreClient):
        """
        Set up the test environment before each test.

        Mocks the service account credentials and Firestore client.
        """
        self.mock_credentials = MockCredentials.from_service_account_file.return_value
        self.mock_firestore_client = MockFirestoreClient.return_value

        self.target = FirestoreClient('fake_credentials_file.json')

    def test_get_all_documents(self):
        """
        Test the get_all_documents method to ensure it retrieves all documents from a Firestore collection.

        Mocks the Firestore collection and document retrieval process.
        """
        # Mock the collection and document retrieved from Firestore
        mock_collection_ref = MagicMock()
        mock_document = MagicMock()
        mock_document.to_dict.return_value = {'field': 'value'}
        mock_collection_ref.stream.return_value = [mock_document]
        self.target.client.collection.return_value = mock_collection_ref

        # Call the method to test
        result = self.target.get_all_documents('test_collection')

        # Verify the interactions and results
        self.target.client.collection.assert_called_once_with('test_collection')
        mock_collection_ref.stream.assert_called_once()
        self.assertEqual(result, [{'field': 'value'}])


if __name__ == '__main__':
    unittest.main()
