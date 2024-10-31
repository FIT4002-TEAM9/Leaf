import io

from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload, MediaFileUpload, MediaIoBaseUpload


class GDriveClient:
    """
    A wrapper around the Google Drive API client.

    Attributes:
        credentials (google.oauth2.service_account.Credentials): The credentials for accessing Google Drive, downloaded
                                                                 from the Google Cloud Console
        client (googleapiclient.discovery.Resource): The Google Drive client instance.
    """

    def __init__(self, client_secret):
        """
        Initializes the GDriveClient with the given client secret file.

        Args:
            client_secret (str): The path to the service account client secret file.
        """
        scope = ['https://www.googleapis.com/auth/drive']

        self.credentials = service_account.Credentials.from_service_account_file(
            filename=client_secret,
            scopes=scope
        )

        self.client = build('drive', 'v3', credentials=self.credentials)

    def downloadFile(self, file_name):
        """
        Downloads a file from Google Drive by its name.

        Args:
            file_name (str): The name of the file to download.

        Returns:
            None
        """
        # Call the Drive v3 API
        fileMetadata = self.client.files().list(fields="nextPageToken, files(id, name, mimeType, size, modifiedTime)",
                                                q="name = '" + file_name + "'").execute()
        fileId = fileMetadata['files'][0]['id']

        # Download the file into a buffer
        downloadRequest = self.client.files().get_media(fileId=fileId)
        file = io.BytesIO()
        downloader = MediaIoBaseDownload(file, downloadRequest)
        done = False
        while done is False:
            status, done = downloader.next_chunk()
            print(f"Download {int(status.progress() * 100)}% complete.")

        # Write the data into a new file
        file.seek(0)
        with open(file_name, 'wb') as f:
            f.write(file.getvalue())

        print(f"File {file_name} downloaded successfully.")

    def uploadFile(self, file_name):
        """
        Uploads a file to Google Drive.

        Args:
            file_name (str): The name of the file to upload.

        Returns:
            str: The ID of the uploaded file.
        """
        file_metadata = {"name": file_name, "parents": ['1BJ6mt9jOKF7fhK_s10l5nvi4OImzObAF']}
        media = MediaFileUpload(file_name, mimetype="text/csv")
        file = self.client.files().create(body=file_metadata, media_body=media, fields="id").execute()
        print(f'File ID: {file.get("id")}')
        return file.get("id")

    def quickUpload(self, file_stream, file_name):
        """
        Uploads a file stream to Google Drive for a Leaf Quick Report.

        Args:
            file_stream (io.BytesIO): The file stream to upload.
            file_name (str): The name of the file to upload.

        Returns:
            str: The ID of the uploaded file.
        """
        file_metadata = {"name": file_name, "parents": ['1BJ6mt9jOKF7fhK_s10l5nvi4OImzObAF']}
        media = MediaIoBaseUpload(file_stream, mimetype="application/zip")
        file = self.client.files().create(body=file_metadata, media_body=media, fields="id").execute()
        print(f'File ID: {file.get("id")}')
        return file.get("id")

    def quickDownload(self, file_id, output_filename):
        """
        Downloads a file from Google Drive by its ID and saves it locally for a Leaf Quick Report.

        Args:
            file_id (str): The ID of the file to download.
            output_filename (str): The name of the output file.

        Returns:
            io.BytesIO: The file stream of the downloaded file.
        """
        request = self.client.files().get_media(fileId=file_id)
        file_stream = io.BytesIO()
        downloader = MediaIoBaseDownload(file_stream, request)

        done = False
        while not done:
            status, done = downloader.next_chunk()
            print(f"Download {int(status.progress() * 100)}% complete.")

        file_stream.seek(0)  # Reset stream position to the beginning
        print(f"File downloaded successfully and saved as {output_filename}")

        return file_stream
