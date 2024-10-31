import { DatabaseCollection } from "../../database/DatabaseCollection";
import DatabaseSession from "../../database/DatabaseSession";
import FileDataObject from "../../database/FileDataObject";
import { compactMap } from "../../language/functions/CompactMap";
import File from "../file/File";

class FileManager {
    public static readonly inst = new FileManager();

    private constructor() {}

    public async getFiles(): Promise<File[]> {
        const dataObjects = await DatabaseSession.inst.readCollection(DatabaseCollection.Files);
        return compactMap(dataObjects, (data) => FileDataObject.restore(data));
    }
}

export default FileManager;
