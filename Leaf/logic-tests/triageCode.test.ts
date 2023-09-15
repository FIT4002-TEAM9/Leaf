import { TriageCode } from "../src/model/triage/TriageCode";
import { strings } from "../src/localisation/Strings";

describe("TriageCode", () => {
    it("should create a new TriageCode instance", () => {
        const immediate = new TriageCode(1);

        expect(immediate).toBeInstanceOf(TriageCode);
        expect(immediate.id).toBe(1);
        expect(immediate.code).toBe(1);
    });

    it("should match TriageCode instances", () => {
        const immediate1 = new TriageCode(1);
        const immediate2 = new TriageCode(1);
        const emergency = new TriageCode(2);

        expect(immediate1.matches(immediate2)).toBe(true);
        expect(immediate1.matches(emergency)).toBe(false);
    });

    it("should convert to string correctly", () => {
        const immediate = TriageCode.immediate;
        const emergency = TriageCode.emergency;
        const urgent = TriageCode.urgent;
        const semiUrgent = TriageCode.semiUrgent;
        const nonUrgent = TriageCode.nonUrgent;

        expect(immediate.toString()).toBe(strings("triageCode.1"));
        expect(emergency.toString()).toBe(strings("triageCode.2"));
        expect(urgent.toString()).toBe(strings("triageCode.3"));
        expect(semiUrgent.toString()).toBe(strings("triageCode.4"));
        expect(nonUrgent.toString()).toBe(strings("triageCode.5"));
    });

    it("should get steps correctly", () => {
        const immediate = TriageCode.immediate;
        const emergency = TriageCode.emergency;
        const urgent = TriageCode.urgent;
        const semiUrgent = TriageCode.semiUrgent;
        const nonUrgent = TriageCode.nonUrgent;

        const immediateSteps = immediate.getSteps();
        const emergencySteps = emergency.getSteps();
        const urgentSteps = urgent.getSteps();
        const semiUrgentSteps = semiUrgent.getSteps();
        const nonUrgentSteps = nonUrgent.getSteps();

        expect(immediateSteps).toEqual(expect.arrayContaining(["Step 1", "Step 2", "Step 3", "Step 4"]));
        expect(emergencySteps).toEqual(expect.arrayContaining(["Step 1", "Step 2", "Step 3", "Step 4"]));
        expect(urgentSteps).toEqual(expect.arrayContaining(["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"]));
        expect(semiUrgentSteps).toEqual(expect.arrayContaining(["Step 1", "Step 2", "Step 3"]));
        expect(nonUrgentSteps).toEqual(expect.arrayContaining(["Step 1", "Step 2"]));
    });

    it("should handle unknown TriageCode", () => {
        const unknownCode = new TriageCode(999); // An arbitrary code not defined

        expect(unknownCode.toString()).toBe(strings("unknown"));
        expect(unknownCode.getSteps()).toEqual([]);
    });
});
