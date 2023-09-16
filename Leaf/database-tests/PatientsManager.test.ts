/**
 * @jest-environment node
 */

import { DatabaseCollection } from "../src/database/DatabaseCollection";
import DatabaseSession from "../src/database/DatabaseSession";
import EmployeeID from "../src/model/employee/EmployeeID";
import Hospital from "../src/model/hospital/Hospital";
import MedicalUnit from "../src/model/hospital/MedicalUnit";
import Ward from "../src/model/hospital/Ward";
import MRN from "../src/model/patient/MRN";
import Patient from "../src/model/patient/Patient";
import PatientChangelog from "../src/model/patient/PatientChangelog";
import PatientEvent from "../src/model/patient/PatientEvent";
import { PatientSex } from "../src/model/patient/PatientSex";
import NewTriageManager from "../src/model/session/NewTriageManager";
import PatientsManager from "../src/model/session/PatientsManager";
import TriageCase from "../src/model/triage/TriageCase";
import { TriageCode } from "../src/model/triage/TriageCode";

const mrn = new MRN("12345"); // Mock MRN
const dob = new Date("1990-01-01"); // Mock Date of Birth
const firstName = "John";
const lastName = "Doe";
const sex = PatientSex.male; // Mock PatientSex
const phoneNumber = "123-456-7890";
const postCode = "12345";
const timeLastAllocated = new Date();
const allocatedTo = new EmployeeID("employee123"); // Mock EmployeeID
const events: PatientEvent[] = [];
const patientChangelog = PatientChangelog.new();

const testHospital = new Hospital("TestHospitalID", "TestHospitalCode", "TestHospitalName");
const testMedicalUnit = new MedicalUnit("TestMedicalUnitID", "TestMedicalUnitName", "TestMedicalUnitGroup");
const testArrivalWard = new Ward("TestArrivalWardID", "TestHospitalCode", "TestArrivalWardName");
const testTriageCode = TriageCode.immediate;
const triageCase = TriageCase.new(testArrivalWard, testHospital, testMedicalUnit, "Test Triage Text", testTriageCode);

const patient = new Patient(
    mrn,
    dob,
    firstName,
    lastName,
    sex,
    phoneNumber,
    triageCase,
    postCode,
    timeLastAllocated,
    allocatedTo,
    events,
    patientChangelog,
);

describe("Patient Manager", () => {
    it("should add a patient to the database", async () => {
        const testPromise = await NewTriageManager.inst.newTriageSubmitted(patient); // Insert patient to Database
        expect(testPromise).toBe(true); // Check if successfully inserted
    });

    it("should retrieve a patient from the database", async () => {
        const retrievedPatient = await PatientsManager.inst.getPatient(patient.mrn); // Retrieve patient from database
        
        if (retrievedPatient != null) {
            expect(retrievedPatient.mrn).toEqual(patient.mrn); // Check if retrieved patient mrn matches expected mrn
            expect(retrievedPatient.fullName).toEqual(patient.fullName); // Check if retrieved patient name matches expected name
        }
    });

    it("should delete a patient from the database", async () => {
        const deletePromise = await DatabaseSession.inst.delete(DatabaseCollection.Patients, patient.mrn.toString()); // Delete entry from database
        expect(deletePromise).toBe(true);
    });
});