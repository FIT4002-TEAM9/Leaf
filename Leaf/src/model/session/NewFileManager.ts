import { DatabaseCollection } from "../../database/DatabaseCollection";
import DatabaseSession from "../../database/DatabaseSession";
import File from "../file/File";
import FileDataObject from "../../database/FileDataObject";

class NewFileManager {
    public static readonly inst = new NewFileManager();

    private constructor() {}

    public async newFileCreated(file: File): Promise<boolean> {
        const dataObject = FileDataObject.create(file);
        return DatabaseSession.inst.insertOne(DatabaseCollection.Files, dataObject.data, file.id.toString());
    }
}

export default NewFileManager;
