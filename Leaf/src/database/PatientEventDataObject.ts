import UUID from "../model/core/UUID";
import PatientEvent from "../model/patient/PatientEvent";
import { PatientEventCategories, PatientEventCategory } from "../model/patient/PatientEventCategory";
import DataObject from "./DataObject";

export enum PatientEventField {
    ID = "id",
    CreatedAt = "createdAt",
    TriggerTime = "triggerTime",
    Title = "title",
    Description = "description",
    Category = "category",
    LastCompleted = "lastCompleted",
    EventData = "eventData",
}

class PatientEventDataObject {
    public static create(event: PatientEvent): DataObject {
        return new DataObject()
            .addString(PatientEventField.ID, event.id.toString())
            .addDate(PatientEventField.CreatedAt, event.createdAt)
            .addDate(PatientEventField.TriggerTime, event.triggerTime)
            .addString(PatientEventField.Title, event.title)
            .addString(PatientEventField.Description, event.description)
            .addString(PatientEventField.Category, event.category.id)
            .addDate(PatientEventField.LastCompleted, event.lastCompleted)
            .addString(PatientEventField.EventData, event.eventData);
    }

    public static restore(data: DataObject): PatientEvent | null {
        const id = data.getStringOrNull(PatientEventField.ID);
        const createdAt = data.getDateOrNull(PatientEventField.CreatedAt);
        const triggerTime = data.getDateOrNull(PatientEventField.TriggerTime);
        const title = data.getStringOrNull(PatientEventField.Title);
        const description = data.getStringOrNull(PatientEventField.Description);
        const category = data.getStringOrNull(PatientEventField.Category);
        const lastCompleted = data.getDateOrNull(PatientEventField.LastCompleted);
        const eventData = data.getString(PatientEventField.EventData);
        if (!id || !createdAt || !triggerTime || !title || !description || !category || lastCompleted == null) {
            console.error("[PatientEventDataObject] Failed to restore PatientEvent");
            return null;
        }
        return new PatientEvent(
            new UUID(id),
            createdAt,
            triggerTime,
            title,
            description,
            new PatientEventCategory(category as PatientEventCategories),
            lastCompleted,
            eventData,
        );
    }
}

export default PatientEventDataObject;
