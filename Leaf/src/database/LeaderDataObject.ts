import EmployeeID from "../model/employee/EmployeeID";
import Leader from "../model/employee/Leader";
import { Hospitals } from "../preset_data/Hospitals";
import DataObject from "./DataObject";

export enum LeaderField {
    ID = "id",
    FirstName = "firstName",
    LastName = "lastName",
    Email = "email",
    CurrentHospitalID = "currentHospitalId",
    AccountActivated = "accountActivated",
}

class LeaderDataObject {
    public static create(leader: Leader): DataObject {
        return new DataObject()
            .addString(LeaderField.ID, leader.id.toString())
            .addString(LeaderField.FirstName, leader.firstName)
            .addString(LeaderField.LastName, leader.lastName)
            .addString(LeaderField.Email, leader.email)
            .addString(LeaderField.CurrentHospitalID, leader.currentHospital?.id?.toString())
            .addBoolean(LeaderField.AccountActivated, leader.accountActivated);
    }

    public static restore(data: DataObject): Leader | null {
        const id = data.getStringOrNull(LeaderField.ID);
        const firstName = data.getStringOrNull(LeaderField.FirstName);
        const lastName = data.getStringOrNull(LeaderField.LastName);
        const email = data.getStringOrNull(LeaderField.Email);
        const currentHospitalID = data.getStringOrNull(LeaderField.CurrentHospitalID);
        const accountActivated = data.getBooleanOrNull(LeaderField.AccountActivated);
        if (!id || !firstName || !lastName || accountActivated == null) {
            // NB: email and current hospital are allowed to be null
            console.error("[LeaderDataObject] Failed to restore Leader");
            return null;
        }
        return new Leader(
            new EmployeeID(id),
            firstName,
            lastName,
            email,
            currentHospitalID == null ? null : Hospitals[currentHospitalID],
            accountActivated,
        );
    }
}

export default LeaderDataObject;
