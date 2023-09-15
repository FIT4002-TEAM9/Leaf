import Leader from "../src/model/employee/Leader";
import { Role } from "../src/model/employee/Role";
import EmployeeID from "../src/model/employee/EmployeeID";
import Hospital from "../src/model/hospital/Hospital";

describe("Leader Class", () => {
    it("should create a new Leader instance", () => {
        const leader = Leader.new("Jane", "Smith", null); // Create a leader instance

        expect(leader).toBeInstanceOf(Leader);
        expect(leader.id).toBeInstanceOf(EmployeeID);
        expect(leader.firstName).toBe("Jane");
        expect(leader.lastName).toBe("Smith");
        expect(leader.email).toBe(null);
        expect(leader.currentHospital).toBe(null);
        expect(leader.accountActivated).toBe(false);
        expect(leader.role).toBe(Role.leader);
    });

    it("should create a new Leader instance with a hospital", () => {
        const hospital = new Hospital("HospitalID", "HospitalCode", "HospitalName");
        const leader = Leader.new("Jane", "Smith", hospital); // Create a leader instance with a hospital

        expect(leader).toBeInstanceOf(Leader);
        expect(leader.id).toBeInstanceOf(EmployeeID);
        expect(leader.firstName).toBe("Jane");
        expect(leader.lastName).toBe("Smith");
        expect(leader.email).toBe(null);
        expect(leader.currentHospital).toBe(hospital);
        expect(leader.accountActivated).toBe(false);
        expect(leader.role).toBe(Role.leader);
    });
});
