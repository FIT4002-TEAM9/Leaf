import UUID from "../model/core/UUID";
import PatientEvent from "../model/patient/PatientEvent";
import { PatientEventCategory } from "../model/patient/PatientEventCategory";
import DataObject from "./DataObject";

export enum PatientEventField {
    ID = "id",
    TriggerTime = "triggerTime",
    Title = "title",
    Description = "description",
    Category = "category",
}

class PatientEventDataObject {
    public static create(event: PatientEvent): DataObject {
        return new DataObject()
            .addString(PatientEventField.ID, event.id.toString())
            .addDate(PatientEventField.TriggerTime, event.triggerTime)
            .addString(PatientEventField.Title, event.title)
            .addString(PatientEventField.Description, event.description)
            .addString(PatientEventField.Category, event.category.id);
    }

    public static restore(data: DataObject): PatientEvent | null {
        const id = data.getStringOrNull(PatientEventField.ID);
        const triggerTime = data.getDateOrNull(PatientEventField.TriggerTime);
        const title = data.getStringOrNull(PatientEventField.Title);
        const description = data.getStringOrNull(PatientEventField.Description);
        const category = data.getStringOrNull(PatientEventField.Category);
        if (!id || !triggerTime || !title || !description || !category) {
            console.error("[PatientEventDataObject] Failed to restore PatientEvent");
            return null;
        }
        return new PatientEvent(new UUID(id), triggerTime, title, description, new PatientEventCategory(category));
    }
}

export default PatientEventDataObject;