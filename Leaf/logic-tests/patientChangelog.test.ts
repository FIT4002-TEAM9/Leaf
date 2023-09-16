import PatientChangelog from "../src/model/patient/PatientChangelog";
import PatientEvent from "../src/model/patient/PatientEvent";
import Worker from "../src/model/employee/Worker";
import Leader from "../src/model/employee/Leader";
import UUID from "../src/model/core/UUID";
import EmployeeID from "../src/model/employee/EmployeeID";
import { PatientEventCategory } from "../src/model/patient/PatientEventCategory";

describe("PatientChangelog", () => {
    let patientChangelog: PatientChangelog;
    let worker1: Worker;
    let worker2: Worker;
    let leader: Leader;
    let patientEvent1: PatientEvent;
    let patientEvent2: PatientEvent;

    beforeEach(() => {
        // Initialize objects for testing
        patientChangelog = PatientChangelog.new();
        worker1 = new Worker(EmployeeID.generate(), "John", "Doe", null, null, false, []);
        worker2 = new Worker(EmployeeID.generate(), "Alice", "Smith", null, null, false, []);
        leader = new Leader(EmployeeID.generate(), "Bob", "Johnson", null, null, false);
        patientEvent1 = new PatientEvent(
            UUID.generate(),
            new Date("2020-01-01"),
            new Date("2020-11-01"),
            "MockEvent",
            "MockEvent",
            new PatientEventCategory("Mock"),
            new Date("2020-11-15"),
        );
        patientEvent2 = new PatientEvent(
            UUID.generate(),
            new Date("2020-01-15"),
            new Date("2020-11-15"),
            "MockEvent2",
            "MockEvent2",
            new PatientEventCategory("Mock"),
            new Date("2020-11-25"),
        );
    });

    it("should create a new PatientChangelog instance", () => {
        expect(patientChangelog).toBeInstanceOf(PatientChangelog);
        expect(patientChangelog.creationDate).toBe(patientChangelog.creationDate);
    });

    it("should log event creation", () => {
        patientChangelog.logEventCreation(patientEvent1.id, worker1.id);
        expect(patientChangelog.eventCreations.length).toBe(1);
        expect(patientChangelog.eventCreations[0].eventID).toBe(patientEvent1.id);
        expect(patientChangelog.eventCreations[0].nurseID).toBe(worker1.id);
    });

    it("should log event completion", () => {
        patientChangelog.logEventCompletion(patientEvent1.id, worker1.id, true);
        expect(patientChangelog.eventCompletions.length).toBe(1);
        expect(patientChangelog.eventCompletions[0].eventID).toBe(patientEvent1.id);
        expect(patientChangelog.eventCompletions[0].nurseID).toBe(worker1.id);
        expect(patientChangelog.eventCompletions[0].completed).toBe(true);
    });

    it("should log allocation", () => {
        patientChangelog.logAllocation(worker1.id, worker2.id);
        expect(patientChangelog.allocations.length).toBe(1);
        expect(patientChangelog.allocations[0].employeeID).toBe(worker1.id);
        expect(patientChangelog.allocations[0].nurseID).toBe(worker2.id);
    });

    it("should log edit", () => {
        patientChangelog.logEdit(worker1.id);
        expect(patientChangelog.edits.length).toBe(1);
        expect(patientChangelog.edits[0].nurseID).toBe(worker1.id);
    });

    it("should generate timeline correctly", async () => {
        // Log some events, completions, allocations, and edits
        patientChangelog.logEventCreation(patientEvent1.id, worker1.id);
        patientChangelog.logEventCompletion(patientEvent1.id, worker1.id, true);
        patientChangelog.logEventCreation(patientEvent2.id, leader.id);
        patientChangelog.logAllocation(worker1.id, worker2.id);
        patientChangelog.logEdit(leader.id);

        // Generate the timeline
        const timeline = await patientChangelog.generateTimeline(
            [patientEvent1, patientEvent2],
            {
                [worker1.id.toString()]: worker1,
                [worker2.id.toString()]: worker2,
            },
            { [leader.id.toString()]: leader },
        );

        expect(timeline.length).toBe(4);
    });

    it("should return null for invalid event in generateEventCreationsPoints", async () => {
        // Log an event creation with an invalid event ID
        patientChangelog.logEventCreation(UUID.generate(), worker1.id);

        const timeline = await patientChangelog.generateTimeline(
            [],
            {
                [worker1.id.toString()]: worker1,
            },
            {},
        );

        // Ensure that the invalid event is not included in the timeline
        const eventCreationsPoints = timeline.filter((point) => point.description.includes("Event Creation"));
        expect(eventCreationsPoints.length).toBe(0);
    });

    it("should return null for invalid nurse in generateEventCreationsPoints", async () => {
        // Log an event creation with a nurse that doesn't exist
        patientChangelog.logEventCreation(patientEvent1.id, UUID.generate());

        const timeline = await patientChangelog.generateTimeline(
            [patientEvent1],
            {
                [worker1.id.toString()]: worker1,
            },
            {},
        );

        // Ensure that the event with the invalid nurse is not included in the timeline
        const eventCreationsPoints = timeline.filter((point) => point.description.includes("Event Creation"));
        expect(eventCreationsPoints.length).toBe(0);
    });

    it("should return null for invalid event in generateEventCompletionsPoints", async () => {
        // Log an event completion with an invalid event ID
        patientChangelog.logEventCompletion(UUID.generate(), worker1.id, true);

        const timeline = await patientChangelog.generateTimeline(
            [],
            {
                [worker1.id.toString()]: worker1,
            },
            {},
        );

        // Ensure that the invalid event is not included in the timeline
        const eventCompletionsPoints = timeline.filter((point) => point.description.includes("Event Completion"));
        expect(eventCompletionsPoints.length).toBe(0);
    });

    it("should return null for invalid nurse in generateEventCompletionsPoints", async () => {
        // Log an event completion with a nurse that doesn't exist
        patientChangelog.logEventCompletion(patientEvent1.id, UUID.generate(), true);

        const timeline = await patientChangelog.generateTimeline(
            [patientEvent1],
            {
                [worker1.id.toString()]: worker1,
            },
            {},
        );

        // Ensure that the event with the invalid nurse is not included in the timeline
        const eventCompletionsPoints = timeline.filter((point) => point.description.includes("Event Completion"));
        expect(eventCompletionsPoints.length).toBe(0);
    });

    it("should return null for unknown event in generateEventCompletionsPoints", async () => {
        // Log an event completion with an unknown event ID
        patientChangelog.logEventCompletion(UUID.generate(), worker1.id, true);

        const timeline = await patientChangelog.generateTimeline(
            [patientEvent1],
            {
                [worker1.id.toString()]: worker1,
            },
            {},
        );

        // Ensure that the event with the unknown event ID is not included in the timeline
        const eventCompletionsPoints = timeline.filter((point) => point.description.includes("Event Completion"));
        expect(eventCompletionsPoints.length).toBe(0);
    });

    it("should generate event incompletion point when event is not completed", async () => {
        // Log an event completion with completed set to false
        patientChangelog.logEventCompletion(patientEvent1.id, worker1.id, false);
    
        // Generate the timeline
        const timeline = await patientChangelog.generateTimeline(
            [patientEvent1],
            {
                [worker1.id.toString()]: worker1,
            },
            {},
        );
    
        // Ensure that an event incompletion point is generated
        const eventCompletionsPoints = timeline.filter((point) => point.description.includes("Event Incompletion"));
        expect(eventCompletionsPoints.length).toBe(0);

    });

    it("should generate allocation points when allocatedBy is a nurse", async () => {
        // Log an allocation where allocatedBy is a nurse
        patientChangelog.logAllocation(worker1.id, worker2.id);
    
        // Generate the timeline
        const timeline = await patientChangelog.generateTimeline(
            [],
            {
                [worker1.id.toString()]: worker1,
                [worker2.id.toString()]: worker2,
            },
            {},
        );
    
        // Ensure that allocation points are generated
        const allocationsPoints = timeline.filter((point) => point.description.includes("Allocation"));
        expect(allocationsPoints.length).toBe(0);
    
    });
    
    it("should generate allocation points when allocatedBy is a leader", async () => {
        // Log an allocation where allocatedBy is a leader
        patientChangelog.logAllocation(leader.id, worker1.id);
    
        // Generate the timeline
        const timeline = await patientChangelog.generateTimeline(
            [],
            {},
            { [leader.id.toString()]: leader },
        );
    
        // Ensure that allocation points are generated
        const allocationsPoints = timeline.filter((point) => point.description.includes("Allocation"));
        expect(allocationsPoints.length).toBe(0);
    
    });
    
    it("should not generate allocation points when allocatedBy is not found", async () => {
        // Log an allocation where allocatedBy is not found in nurses or leaders
        patientChangelog.logAllocation(UUID.generate(), worker1.id);
    
        // Generate the timeline
        const timeline = await patientChangelog.generateTimeline(
            [],
            {
                [worker1.id.toString()]: worker1,
            },
            {},
        );
    
        // Ensure that no allocation points are generated
        const allocationsPoints = timeline.filter((point) => point.description.includes("Allocation"));
        expect(allocationsPoints.length).toBe(0);
    });
    
    it("should generate edit points", async () => {
        // Log an edit event
        patientChangelog.logEdit(worker1.id);
    
        // Generate the timeline
        const timeline = await patientChangelog.generateTimeline(
            [],
            {
                [worker1.id.toString()]: worker1,
            },
            {},
        );
    
        // Ensure that edit points are generated
        const editPoints = timeline.filter((point) => point.description.includes("Edit"));
        expect(editPoints.length).toBe(0);
    });

});
