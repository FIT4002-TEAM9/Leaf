import os.path
import pyzipper


def createZippedOmopReport(directory, password):
    """
    Creates a zipped report of the specified directory, encrypted with a password.

    Args:
        directory (str): The directory to zip.
        password (str): The password for the zipped file.

    Returns:
        None
    """

    # Get a list of all files in the output folder
    parent_folder = os.path.dirname('./' + directory)
    contents = os.walk(parent_folder)

    # Create an empty zip file with the directory name
    zip_file = pyzipper.AESZipFile(directory + '.zip', 'w', compression=pyzipper.ZIP_DEFLATED, encryption=pyzipper.WZ_AES)
    zip_file.pwd = password.encode()
    for root, folders, files in contents:
        if root == './' + directory:  # Ensure we're taking files from the correct directory
            for folder_name in folders:
                # Get the current path and create a relative path for the zip to reference
                absolute_path = os.path.join(root, folder_name)
                relative_path = absolute_path.replace(parent_folder + '\\', '')
                print("Adding '%s' to archive." % absolute_path)
                zip_file.write(absolute_path, relative_path)
            for file_name in files:
                absolute_path = os.path.join(root, file_name)
                relative_path = absolute_path.replace(parent_folder + '\\', '')
                print("Adding '%s' to archive." % absolute_path)
                zip_file.write(absolute_path, relative_path)

    zip_file.close()


def convertOmopTablesToCsv(db, report_name):
    """
    Converts OMOP tables from the database into CSV files.

    Args:
        db (PostgresClient): The database client instance.
        report_name (str): The name of the report to generate.

    Returns:
        None
    """
    db.connect()

    # Convert OMOP tables into CSV's
    db.read_table_into_csv('omop_person', f'./{report_name}/')
    db.read_table_into_csv('omop_location', f'./{report_name}/')
    db.read_table_into_csv('omop_care_site', f'./{report_name}/')
    db.read_table_into_csv('omop_provider', f'./{report_name}/')
    db.read_table_into_csv('omop_observation_period', f'./{report_name}/')
    db.read_table_into_csv('omop_drug_exposure', f'./{report_name}/')
    db.read_table_into_csv('omop_device_exposure', f'./{report_name}/')
    db.read_table_into_csv('omop_visit_occurrence', f'./{report_name}/')
    db.read_table_into_csv('omop_condition_occurrence', f'./{report_name}/')
    db.read_table_into_csv('omop_procedure_occurrence', f'./{report_name}/')
    db.read_table_into_csv('omop_measurement', f'./{report_name}/')
    db.read_table_into_csv('omop_observation', f'./{report_name}/')
    db.read_table_into_csv('omop_episode', f'./{report_name}/')
    db.read_table_into_csv('omop_note', f'./{report_name}/')

    db.close()
