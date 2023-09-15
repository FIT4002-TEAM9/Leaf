import MRN from "../src/model/patient/MRN";

describe("MRN Class", () => {
    it("should match the ID for the patient", () => {
        new MRN("testmatch").matches(new MRN("testmatch"));
    });
});
