import { PatientEventCategories } from "../../../model/patient/PatientEventCategory";

export let EventCategoryFields: { [key in PatientEventCategories]: any} = {
  [PatientEventCategories.DRUG_EXPOSURE]: {
    "Drug Name": "string",
    "Drug Dose": "number",
    "Drug Dose Unit": "string",
    "Drug Exposure Start Date": "date",
  },
  [PatientEventCategories.VISIT_OCCURRENCE]: {
    "Visit Type": "string", // TO-DO: Visit Type Drop-Down
    "Visit Start Date": "date",
    "Visit End Date": "date",
    "Hospital": "string", // TO-DO: Hospital Drop-Down
  },
  [PatientEventCategories.CONDITION_OCCURRENCE]: {
    "Condition Name": "string",
    "Condition Start Date": "date",
  },
  [PatientEventCategories.PROCEDURE_OCCURRENCE]: {
    "Procedure Type": "string",
    "Procedure Date": "date",
    "Provider": "string", // TO-DO: Provider Drop-Down
  },
  [PatientEventCategories.DEVICE_EXPOSURE]: {
    "Device": "string",
    "Device Exposure Start Date": "date",
    "Provider": "string", // TO-DO: Provider Drop-Down
  },
  [PatientEventCategories.MEASUREMENT]: {
    "Measurement Value": "number",
    "Unit": "string",
    "Provider": "string", // TO-DO: Provider Drop-Down
  },
  [PatientEventCategories.OBSERVATION]: {},
  [PatientEventCategories.EPISODE]: {},
  [PatientEventCategories.NOTE]: {},
}
