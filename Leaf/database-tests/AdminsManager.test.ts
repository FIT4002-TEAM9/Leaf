/**
 * @jest-environment node
 */
import { DatabaseCollection } from "../src/database/DatabaseCollection";
import DatabaseSession from "../src/database/DatabaseSession";
import Admin from "../src/model/employee/Admin";
import AdminsManager from "../src/model/session/AdminsManager";
import NewEmployeeManager from "../src/model/session/NewEmployeeManager";

const admin = Admin.new("John", "Doe"); // Create an admin instance

describe("Admin Manager", () => {
    it("should add an Admin to the database", async () => {
        const testPromise = await NewEmployeeManager.inst.newAdminCreated(admin); // Insert admin to database

        expect(testPromise).toBe(true); // Check if successfully inserted admin to Database
    });

    it("should retrieve an Admin from the database", async () => {
        const retrievedAdmin = await AdminsManager.inst.getAdmin(admin.id); // retrieve the admin from the database

        if (retrievedAdmin != null) {
            expect(retrievedAdmin.id).toEqual(admin.id); // check if id matches
            expect(retrievedAdmin.fullName).toEqual(admin.fullName); // check if name matches
        }
    });
        
    it("should delete an Admin from the database", async () => {
        const deletePromise = await DatabaseSession.inst.delete(DatabaseCollection.Admins, admin.id.toString()); // Delete entry from database
        expect(deletePromise).toBe(true);
    });
})