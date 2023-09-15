import Patient from "../src/model/patient/Patient";
import MRN from "../src/model/patient/MRN";
import { PatientSex } from "../src/model/patient/PatientSex";
import TriageCase from "../src/model/triage/TriageCase";
import Ward from "../src/model/hospital/Ward";
import EmployeeID from "../src/model/employee/EmployeeID";
import PatientEvent from "../src/model/patient/PatientEvent";
import { TriageCode } from '../src/model/triage/TriageCode';
import PatientChangelog from '../src/model/patient/PatientChangelog';
import Hospital from '../src/model/hospital/Hospital';
import MedicalUnit from '../src/model/hospital/MedicalUnit';
import UUID from "../src/model/core/UUID";
import { PatientEventCategory } from "../src/model/patient/PatientEventCategory";

describe('Patient Class', () => {
  it('should create a new Patient instance', () => {
    const mrn = new MRN('12345'); // Mock MRN
    const dob = new Date('1990-01-01'); // Mock Date of Birth
    const firstName = 'John';
    const lastName = 'Doe';
    const sex = PatientSex.male; // Mock PatientSex
    const phoneNumber = '123-456-7890';
    const postCode = '12345';
    const timeLastAllocated = new Date();
    const allocatedTo = new EmployeeID('employee123'); // Mock EmployeeID
    const events: PatientEvent[] = [];
    const patientChangelog = PatientChangelog.new();

    const testHospital = new Hospital('TestHospitalID', 'TestHospitalCode', 'TestHospitalName');
    const testMedicalUnit = new MedicalUnit('TestMedicalUnitID', 'TestMedicalUnitName', 'TestMedicalUnitGroup');
    const testArrivalWard = new Ward('TestArrivalWardID', 'TestHospitalCode', 'TestArrivalWardName');
    const testTriageCode = TriageCode.immediate;
    const triageCase = TriageCase.new(
        testArrivalWard,
        testHospital,
        testMedicalUnit,
        'Test Triage Text',
        testTriageCode
    );

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
      patientChangelog
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

    expect(patient.fullName).toBe(`${firstName} ${lastName}`)
  });

  it('should add an event to the patient', () => {
    const mrn = new MRN('12345'); // Mock MRN
    const dob = new Date('1990-01-01'); // Mock Date of Birth
    const firstName = 'John';
    const lastName = 'Doe';
    const sex = PatientSex.male; // Mock PatientSex
    const phoneNumber = '123-456-7890';
    const postCode = '12345';
    const timeLastAllocated = new Date();
    const allocatedTo = new EmployeeID('employee123'); // Mock EmployeeID
    const events: PatientEvent[] = [];
    const patientChangelog = PatientChangelog.new();

    const testHospital = new Hospital('TestHospitalID', 'TestHospitalCode', 'TestHospitalName');
    const testMedicalUnit = new MedicalUnit('TestMedicalUnitID', 'TestMedicalUnitName', 'TestMedicalUnitGroup');
    const testArrivalWard = new Ward('TestArrivalWardID', 'TestHospitalCode', 'TestArrivalWardName');
    const testTriageCode = TriageCode.immediate;
    const triageCase = TriageCase.new(
        testArrivalWard,
        testHospital,
        testMedicalUnit,
        'Test Triage Text',
        testTriageCode
    );

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
      patientChangelog
    );

    const event = new PatientEvent(UUID.generate(), new Date('2020-01-01'), new Date('2020-11-01'), "MockEvent", "MockEvent", new PatientEventCategory("Mock"), new Date("2020-11-15")); // Mock PatientEvent

    patient.addEvent(event);

    expect(patient.events).toContain(event);
  });
});
