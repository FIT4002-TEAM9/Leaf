import Worker from "../src/model/employee/Worker";
import MRN from "../src/model/patient/MRN";
import { Role } from "../src/model/employee/Role";
import Hospital from "../src/model/hospital/Hospital";
import EmployeeID from "../src/model/employee/EmployeeID";
import Patient from "../src/model/patient/Patient";
import { PatientSex } from "../src/model/patient/PatientSex";
import TriageCase from "../src/model/triage/TriageCase";
import Ward from "../src/model/hospital/Ward";
import MedicalUnit from "../src/model/hospital/MedicalUnit";
import { TriageCode } from "../src/model/triage/TriageCode";
import PatientChangelog from "../src/model/patient/PatientChangelog";

const testHospital = new Hospital("TestHospitalID", "TestHospitalCode", "TestHospitalName");
const testMedicalUnit = new MedicalUnit("TestMedicalUnitID", "TestMedicalUnitName", "TestMedicalUnitGroup");
const testArrivalWard = new Ward("TestArrivalWardID", "TestHospitalCode", "TestArrivalWardName");
const testTriageCode = TriageCode.immediate;
const triageCase = TriageCase.new(testArrivalWard, testHospital, testMedicalUnit, "Test Triage Text", testTriageCode);
const patientChangelog = PatientChangelog.new();

describe("Worker Class", () => {
    it("should create a new Worker instance", () => {
        const worker = Worker.new("John", "Doe", null); // Create a worker instance

        expect(worker).toBeInstanceOf(Worker);
        expect(worker.id).toBeInstanceOf(EmployeeID);
        expect(worker.firstName).toBe("John");
        expect(worker.lastName).toBe("Doe");
        expect(worker.email).toBe(null);
        expect(worker.currentHospital).toBe(null);
        expect(worker.accountActivated).toBe(false);
        expect(worker.allocatedPatients).toEqual([]);
        expect(worker.role).toBe(Role.worker);
    });

    it("should allocate a patient to the worker", () => {
        const worker = Worker.new("John", "Doe", null); // Create a worker instance
        const patientMRN = new MRN("12345"); // Mock MRN
        const patient = new Patient(
            patientMRN,
            new Date("1990-01-01"),
            "Jane",
            "Smith",
            PatientSex.female,
            "123-456-7890",
            triageCase,
            "12345",
            new Date(),
            new EmployeeID("472749"),
            [],
            patientChangelog,
        );

        worker.allocatePatient(patient);

        expect(worker.allocatedPatients).toContain(patientMRN);
    });
});