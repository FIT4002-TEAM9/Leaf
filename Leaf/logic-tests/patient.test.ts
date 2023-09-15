import Patient from "../src/model/patient/Patient";
import MRN from "../src/model/patient/MRN";
import { PatientSex } from "../src/model/patient/PatientSex";
import TriageCase from "../src/model/triage/TriageCase";
import Ward from "../src/model/hospital/Ward";
import EmployeeID from "../src/model/employee/EmployeeID";
import PatientEvent from "../src/model/patient/PatientEvent";
import { TriageCode } from "../src/model/triage/TriageCode";
import PatientChangelog from "../src/model/patient/PatientChangelog";
import Hospital from "../src/model/hospital/Hospital";
import MedicalUnit from "../src/model/hospital/MedicalUnit";
import UUID from "../src/model/core/UUID";
import { PatientEventCategory } from "../src/model/patient/PatientEventCategory";

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

describe("Patient Class", () => {
    it("should create a new Patient instance", () => {
        const patientFactory = Patient.new(
            mrn,
            dob,
            firstName,
            lastName,
            sex,
            phoneNumber,
            triageCase,
            postCode,
            allocatedTo,
        );

        expect(patient).toBeInstanceOf(Patient);
        expect(patient.mrn).toBe(mrn);
        expect(patient.dob).toBe(dob);
        expect(patient.firstName).toBe(firstName);
        expect(patient.lastName).toBe(lastName);
        expect(patient.sex).toBe(sex);
        expect(patient.phoneNumber).toBe(phoneNumber);
        expect(patient.triageCase).toBe(triageCase);
        expect(patient.postCode).toBe(postCode);
        expect(patient.timeLastAllocated).toBe(timeLastAllocated);
        expect(patient.idAllocatedTo).toBe(allocatedTo);
        expect(patient.events).toBe(events);
        expect(patient.changelog).toBe(patientChangelog);

        expect(patient.fullName).toBe(`${firstName} ${lastName}`);

        expect(patient.mrn).toBe(patientFactory.mrn);
        expect(patient.dob).toBe(patientFactory.dob);
        expect(patient.firstName).toBe(patientFactory.firstName);
        expect(patient.lastName).toBe(patientFactory.lastName);
        expect(patient.sex).toBe(patientFactory.sex);
        expect(patient.phoneNumber).toBe(patientFactory.phoneNumber);
        expect(patient.triageCase).toBe(patientFactory.triageCase);
        expect(patient.postCode).toBe(patientFactory.postCode);
        expect(patient.idAllocatedTo).toBe(patientFactory.idAllocatedTo);
    });

    it("should add an event to the patient", () => {
        const event = new PatientEvent(
            UUID.generate(),
            new Date("2020-01-01"),
            new Date("2020-11-01"),
            "MockEvent",
            "MockEvent",
            new PatientEventCategory("Mock"),
            new Date("2020-11-15"),
        ); // Mock PatientEvent

        patient.addEvent(event);

        expect(patient.events).toContain(event);
    });

    it("should allocate patient to nurse", () => {
        const nurseId = new EmployeeID("9809");
        patient.allocateTo(nurseId);
        expect(patient.idAllocatedTo).toBe(nurseId);
    });

    it("should edit patient triage case", () => {
        const newHospital = new Hospital("newHospitalID", "newHospitalCode", "newHospitalName");
        const newMedicalUnit = new MedicalUnit("newMedicalUnitID", "newMedicalUnitName", "newMedicalUnitGroup");
        const newArrivalWard = new Ward("newArrivalWardID", "newArrivalWardCode", "newArrivalWardName");
        const description = "Mock New Triage";
        const newTriageCode = TriageCode.emergency;

        expect(testHospital).not.toBe(newHospital);
        expect(testMedicalUnit).not.toBe(newMedicalUnit);
        expect(testArrivalWard).not.toBe(newArrivalWard);
        expect(testTriageCode).not.toBe(newTriageCode);

        patient.editTriage(newArrivalWard, newHospital, newMedicalUnit, description, newTriageCode);

        expect(patient.triageCase.arrivalWard).toBe(newArrivalWard);
        expect(patient.triageCase.hospital).toBe(newHospital);
        expect(patient.triageCase.medicalUnit).toBe(newMedicalUnit);
        expect(patient.triageCase.triageCode).toBe(newTriageCode);
    });
});
