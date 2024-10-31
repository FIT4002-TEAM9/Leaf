export enum PatientEventCategories {
    DRUG_EXPOSURE = "DRUG EXPOSURE",
    VISIT_OCCURRENCE = "VISIT OCCURRENCE",
    CONDITION_OCCURRENCE = "CONDITION OCCURRENCE",
    PROCEDURE_OCCURRENCE = "PROCEDURE OCCURRENCE",
    DEVICE_EXPOSURE = "DEVICE EXPOSURE",
    MEASUREMENT = "MEASUREMENT",
    OBSERVATION = "OBSERVATION",
    EPISODE = "EPISODE",
    NOTE = "NOTE",
}

export class PatientEventCategory {
    public readonly id: PatientEventCategories;

    constructor(id: PatientEventCategories) {
        this.id = id;
    }

    public matches(other: PatientEventCategory) {
        return this.id == other.id;
    }

    public toString(): string {
        return this.id.toString();
    }
}
