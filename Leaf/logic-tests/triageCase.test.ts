import TriageCase from "../src/model/triage/TriageCase";
import Hospital from "../src/model/hospital/Hospital";
import MedicalUnit from "../src/model/hospital/MedicalUnit";
import Ward from "../src/model/hospital/Ward";
import { TriageCode } from "../src/model/triage/TriageCode";
import UUID from "../src/model/core/UUID";

describe("TriageCase", () => {
    it("should create a new TriageCase instance", () => {
        const id = UUID.generate();
        const arrivalDate = new Date("2022-01-01");
        const dischargeDate = null;
        const arrivalWard = new Ward("TestArrivalWardID", "TestHospitalCode", "TestArrivalWardName");
        const dischargeWard = null;
        const hospital = new Hospital("TestHospitalID", "TestHospitalCode", "TestHospitalName");
        const medicalUnit = new MedicalUnit("TestMedicalUnitID", "TestMedicalUnitName", "TestMedicalUnitGroup");
        const triageText = "Triage Text";
        const triageCode = TriageCode.immediate;

        const triageCase = new TriageCase(
            id,
            arrivalDate,
            dischargeDate,
            arrivalWard,
            dischargeWard,
            hospital,
            medicalUnit,
            triageText,
            triageCode,
        );

        expect(triageCase).toBeInstanceOf(TriageCase);
        expect(triageCase.id).toBe(id);
        expect(triageCase.arrivalDate).toBe(arrivalDate);
        expect(triageCase.dischargeDate).toBe(dischargeDate);
        expect(triageCase.arrivalWard).toBe(arrivalWard);
        expect(triageCase.dischargeWard).toBe(dischargeWard);
        expect(triageCase.hospital).toBe(hospital);
        expect(triageCase.medicalUnit).toBe(medicalUnit);
        expect(triageCase.triageText).toBe(triageText);
        expect(triageCase.triageCode).toBe(triageCode);
    });

    it("should create a new TriageCase instance using the static new method", () => {
        const arrivalWard = new Ward("TestArrivalWardID", "TestHospitalCode", "TestArrivalWardName");
        const hospital = new Hospital("TestHospitalID", "TestHospitalCode", "TestHospitalName");
        const medicalUnit = new MedicalUnit("TestMedicalUnitID", "TestMedicalUnitName", "TestMedicalUnitGroup");
        const triageText = "Triage Text";
        const triageCode = TriageCode.immediate;

        const triageCase = TriageCase.new(arrivalWard, hospital, medicalUnit, triageText, triageCode);

        expect(triageCase).toBeInstanceOf(TriageCase);
        expect(triageCase.id).toBeDefined();
        expect(triageCase.arrivalDate).toBeInstanceOf(Date);
        expect(triageCase.dischargeDate).toBeNull();
        expect(triageCase.arrivalWard).toBe(arrivalWard);
        expect(triageCase.dischargeWard).toBeNull();
        expect(triageCase.hospital).toBe(hospital);
        expect(triageCase.medicalUnit).toBe(medicalUnit);
        expect(triageCase.triageText).toBe(triageText);
        expect(triageCase.triageCode).toBe(triageCode);
    });
});
