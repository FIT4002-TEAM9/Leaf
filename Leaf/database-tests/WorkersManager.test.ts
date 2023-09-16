/**
 * @jest-environment node
 */

import { DatabaseCollection } from "../src/database/DatabaseCollection";
import DatabaseSession from "../src/database/DatabaseSession";
import Worker from "../src/model/employee/Worker"
import NewEmployeeManager from "../src/model/session/NewEmployeeManager";
import WorkersManager from "../src/model/session/WorkersManager";

const worker = Worker.new("John", "Doe", null);

describe("Worker Manager", () => {
    it("should add a Worker to the database", async () => {
        const testPromise = await NewEmployeeManager.inst.newWorkerCreated(worker); // Insert Worker to the database

        expect(testPromise).toBe(true); // Check if insert successful
    });

    it("should retrieve a Worker from the database", async () => {
        const retrievedWorker = await WorkersManager.inst.getWorker(worker.id); // Retrieve worker from the database

        if (retrievedWorker != null) {
            expect(retrievedWorker.id).toEqual(worker.id); // Check if retrieved worker id matches expected worker id
            expect(retrievedWorker.fullName).toEqual(worker.fullName); // Check if retrieved worker name matches expected worker name
        }
    });

    it("should delete a Worker from the database", async () => {
        const deletePromise = await DatabaseSession.inst.delete(DatabaseCollection.Workers, worker.id.toString()); // Delete entry from database
        expect(deletePromise).toBe(true); // Check if successfully deleted
    });
});