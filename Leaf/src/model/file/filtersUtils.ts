import { FileFilters} from "./FileFilters";
import DataObject from "../../database/DataObject";

export function filtersToDataObject(filters: FileFilters): DataObject {
    const dataObject = new DataObject();
    dataObject
        .addString("assigned_to", filters.assigned_to)
        .addString("hospital_site", filters.hospital_site)
        .addString("medical_unit", filters.medical_unit)
        .addString("sex", filters.sex)
        .addStringArray("triage_code", filters.triage_code)
        .addString("ward", filters.ward);
    return dataObject;
}
