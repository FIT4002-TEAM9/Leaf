import {FileFilters} from "./FileFilters";

// Class representing a file with various properties and methods
class File {
    // Public property for the file's unique ID
    public id: string;

    // Protected properties with private-like access, requiring getters and setters
    protected _title: string;
    protected _author: string;
    protected _reportType: string;
    protected _password: string;
    protected _created: Date;
    protected _filters: FileFilters = {};

    // Getter for the file's title
    public get title(): string {
        return this._title;
    }

    // Getter for the file's author
    public get author(): string {
        return this._author;
    }

    // Getter for the report type of the file
    public get reportType(): string {
        return this._reportType;
    }

    // Getter for the file's password
    public get password(): string {
        return this._password;
    }

    // Getter for the creation date of the file
    public get created(): Date {
        return this._created;
    }

    // Getter for the file's filters
    public get filters(): FileFilters {
        return this._filters;
    }

    // Constructor to initialize the file with provided values
    constructor(
        id: string,
        title: string,
        author: string,
        reportType: string,
        password: string,
        created: Date,
        filters: FileFilters
    ) {
        this.id = id;
        this._title = title;
        this._author = author;
        this._reportType = reportType;
        this._password = password;
        this._created = created;
        this._filters = filters;
    }

    // Method to set a new title for the file
    public setTitle(title: string) {
        this._title = title;
    }

    // Method to set a new password for the file
    public setPassword(password: string) {
        this._password = password;
    }
}

export default File;
