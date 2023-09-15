import Admin from "../src/model/employee/Admin";
import { Role } from "../src/model/employee/Role";
import EmployeeID from "../src/model/employee/EmployeeID";

describe("Admin Class", () => {
    it("should create a new Admin instance", () => {
        const admin = Admin.new("John", "Doe"); // Create an admin instance

        expect(admin).toBeInstanceOf(Admin);
        expect(admin.id).toBeInstanceOf(EmployeeID);
        expect(admin.firstName).toBe("John");
        expect(admin.lastName).toBe("Doe");
        expect(admin.email).toBe(null);
        expect(admin.currentHospital).toBe(null);
        expect(admin.accountActivated).toBe(false);
        expect(admin.role).toBe(Role.admin);
    });
});
