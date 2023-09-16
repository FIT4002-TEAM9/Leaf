import Admin from "../src/model/employee/Admin";
import AdminsManager from "../src/model/session/AdminsManager";

describe("Admin Manager", () => {
    it("should add an Admin to the database", () => {
        const admin = Admin.new("John", "Doe"); // Create an admin instance

        const testPromise = AdminsManager.inst.updateAdmin(admin); // Insert admin to database

        expect(testPromise).resolves.toBe(true); // Check if successfully inserted admin to Database

        const retrievedAdmin = AdminsManager.inst.getAdmin(admin.id); // retrieve the admin from the database

        expect(retrievedAdmin).resolves.toBeInstanceOf(Admin); // Check if retrieved object is an instance of Admin


    })
});