import { Role } from "../src/model/employee/Role";
import { strings } from "../src/localisation/Strings";

describe("Role Class", () => {
    it("should create a new Role instance", () => {
        const role = new Role("WORKER"); // Create a role instance

        expect(role).toBeInstanceOf(Role);
        expect(role.id).toBe("WORKER");
    });

    it("should convert Role to string", () => {
        const workerRole = new Role("WORKER");
        const leaderRole = new Role("LEADER");
        const adminRole = new Role("ADMIN");
        const unknownRole = new Role("UNKNOWN");

        expect(workerRole.toString()).toBe(strings("role.worker")); // Make sure to adjust the expected string based on your localization
        expect(leaderRole.toString()).toBe(strings("role.leader")); // Make sure to adjust the expected string based on your localization
        expect(adminRole.toString()).toBe(strings("role.admin")); // Make sure to adjust the expected string based on your localization
        expect(unknownRole.toString()).toBe("Unknown"); // Make sure to adjust the expected string based on your localization
    });

    it("should match roles correctly", () => {
        const workerRole1 = new Role("WORKER");
        const workerRole2 = new Role("WORKER");
        const leaderRole = new Role("LEADER");
        const adminRole = new Role("ADMIN");

        expect(workerRole1.matches(workerRole2)).toBe(true);
        expect(workerRole1.matches(leaderRole)).toBe(false);
        expect(workerRole1.matches(adminRole)).toBe(false);
    });
});
