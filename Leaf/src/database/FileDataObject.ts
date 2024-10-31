import File from "../model/file/File"; // Import the File class from the appropriate path
import {FileFilters} from "../model/file/FileFilters"; // Import FileFilters type
import DataObject from "./DataObject"; // Import DataObject class used for serialization
import {filtersToDataObject} from "../model/file/filtersUtils"; // Import utility function to convert filters to DataObject

// Enum defining the fields used in FileDataObject
export enum FileField {
    ID = "id",
    Title = "title",
    Author = "author",
    ReportType = "reportType",
    Password = "password",
    Created = "created",
    Filters = "filters",
}

// Class responsible for creating and restoring File instances using DataObject
class FileDataObject {

    // Create a DataObject from a File instance
    public static create(file: File): DataObject {
        return new DataObject()
            .addString(FileField.ID, file.id) // Add file ID to DataObject
            .addString(FileField.Title, file.title) // Add file title to DataObject
            .addString(FileField.Author, file.author) // Add file author to DataObject
            .addString(FileField.ReportType, file.reportType) // Add file report type to DataObject
            .addString(FileField.Password, file.password) // Add file password to DataObject
            .addDate(FileField.Created, file.created) // Add file creation date to DataObject
            .addObject(FileField.Filters, filtersToDataObject(file.filters)); // Add file filters to DataObject
    }

    // Restore a File instance from a DataObject
    public static restore(data: DataObject): File | null {
        // Retrieve values from DataObject
        const id = data.getStringOrNull(FileField.ID);
        const title = data.getStringOrNull(FileField.Title);
        const author = data.getStringOrNull(FileField.Author);
        const reportType = data.getStringOrNull(FileField.ReportType);
        const password = data.getStringOrNull(FileField.Password);
        const created = data.getDateOrNull(FileField.Created);
        const filters = data.getObjectOrNull<FileFilters>(FileField.Filters);

        // Check if all required fields are present
        if (!id || !title || !author || !reportType || !password || created == null || filters == null) {
            console.error("[FileDataObject] Failed to restore File"); // Log an error if restoration fails
            return null;
        }

        // Return a new File instance if all fields are valid
        return new File(id, title, author, reportType, password, created, filters);
    }
}

export default FileDataObject;