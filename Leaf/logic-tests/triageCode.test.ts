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

        expect(immediateSteps).toEqual(
            expect.arrayContaining([
                strings("triageCodeSteps.immediate.1"),
                strings("triageCodeSteps.immediate.2"),
                strings("triageCodeSteps.immediate.3"),
                strings("triageCodeSteps.immediate.4"),
            ]),
        );
        expect(emergencySteps).toEqual(
            expect.arrayContaining([
                strings("triageCodeSteps.emergency.1"),
                strings("triageCodeSteps.emergency.2"),
                strings("triageCodeSteps.emergency.3"),
                strings("triageCodeSteps.emergency.4", TriageCode.immediate.code.toString()),
            ]),
        );
        expect(urgentSteps).toEqual(
            expect.arrayContaining([
                strings("triageCodeSteps.urgent.1"),
                strings("triageCodeSteps.urgent.2"),
                strings("triageCodeSteps.urgent.3"),
                strings("triageCodeSteps.urgent.4"),
                strings("triageCodeSteps.urgent.5"),
            ]),
        );
        expect(semiUrgentSteps).toEqual(
            expect.arrayContaining([
                strings("triageCodeSteps.semiUrgent.1"),
                strings("triageCodeSteps.semiUrgent.2"),
                strings("triageCodeSteps.semiUrgent.3"),
            ]),
        );
        expect(nonUrgentSteps).toEqual(
            expect.arrayContaining([strings("triageCodeSteps.nonUrgent.1"), strings("triageCodeSteps.nonUrgent.2")]),
        );
    });

    it("should handle unknown TriageCode", () => {
        const unknownCode = new TriageCode(999); // An arbitrary code not defined

        expect(unknownCode.toString()).toBe(strings("unknown"));
        expect(unknownCode.getSteps()).toEqual([]);
    });
});
