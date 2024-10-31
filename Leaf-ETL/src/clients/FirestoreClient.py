from google.cloud import firestore
from google.oauth2 import service_account


class FirestoreClient:
    """
    A wrapper around the Google Cloud Firestore client.

    Attributes:
        credentials (google.oauth2.service_account.Credentials): The credentials for accessing Firestore, downloaded
                                                                 from the Google Cloud Console
        client (google.cloud.firestore.Client): The Firestore client instance.
    """

    def __init__(self, credentials_file):
        """
        Initializes the FirestoreClient with the provided credentials file.

        Args:
            credentials_file (str): The path to the service account credentials file.
        """
        self.credentials = service_account.Credentials.from_service_account_file(credentials_file)
        self.client = firestore.Client(credentials=self.credentials)

    def get_all_documents(self, collection_name):
        """
        Retrieves all documents from the specified Firestore collection.

        Args:
            collection_name (str): The name of the Firestore collection.

        Returns:
            list: A list of dictionaries, each representing a document in the collection.
        """
        collection_ref = self.client.collection(collection_name)
        collection_docs = collection_ref.stream()

        # Read the stream into a list before returning to save db reads
        return [doc.to_dict() for doc in collection_docs]
