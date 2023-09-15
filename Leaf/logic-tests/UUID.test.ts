import UUID from "../src/model/core/UUID";

describe("UUID Class", () => {
    it("should match the ID for the patient", () => {
        new UUID("testmatch").matches(new UUID("testmatch"));
    });
});
