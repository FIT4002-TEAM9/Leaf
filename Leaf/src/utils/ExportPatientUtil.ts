import Patient from "../model/patient/Patient";
import axios from "axios";

// Define the URL of your Flask backend endpoint
const FLASK_BACKEND_URL = 'http://127.0.0.1:5000/upload';

export const exportPatient = async (selectedPatients: Patient[], title: string, password: string) => {
    if (selectedPatients.length === 0) {
        return;
    }

    const filename = `${title}.csv`;
    let csvData = "MRN,DOB,FirstName,LastName,Gender,PhoneNumber,PostCode,TimeLastAllocated,AllocatedTo,Events\n";
    for (const patient of selectedPatients) {
        let allEvents = "";
        for (const event of patient.events) {
            allEvents += `[${event.getExportSummary()}]`;
        }
        csvData += `${patient.mrn},${patient.dob},${patient.firstName},${patient.lastName},${patient.sex},${patient.phoneNumber},${patient.postCode},${patient.timeLastAllocated},${patient.idAllocatedTo},${allEvents}\n`;
    }

    try {
        // Create a FormData object to send the CSV file
        const formData = new FormData();
        formData.append('file', new Blob([csvData], {type: 'text/csv'}), filename);
        formData.append('password', password);  // Add the password to the form data

        // Send the FormData object to the Flask backend
        const response = await axios.post(FLASK_BACKEND_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log('File uploaded successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error uploading file to backend:', error);
    }
};
