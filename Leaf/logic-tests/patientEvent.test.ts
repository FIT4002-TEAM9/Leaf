import PatientEvent from "../src/model/patient/PatientEvent";
import { PatientEventCategory } from "../src/model/patient/PatientEventCategory";
import UUID from "../src/model/core/UUID";

describe('PatientEvent', () => {
  let event: PatientEvent;

  beforeEach(() => {
    event = PatientEvent.new(new Date(2023, 8, 15, 11, 0), "Test Event", "Event Description", PatientEventCategory.other);
  });

  it('should create a new PatientEvent instance', () => {
    expect(event).toBeInstanceOf(PatientEvent);
    expect(event.createdAt).toBeInstanceOf(Date);
    expect(event.triggerTime).toBeInstanceOf(Date);
    expect(event.title).toBe("Test Event");
    expect(event.description).toBe("Event Description");
    expect(event.category).toBe(PatientEventCategory.other);
    expect(event.lastCompleted).toEqual(new Date(0));
  });

  it('should mark the event as completed', () => {
    event.markCompleted();
    expect(event.lastCompleted).not.toEqual(new Date(0));
  });

  it('should mark the event as incomplete', () => {
    event.markCompleted();
    event.markIncomplete();
    expect(event.lastCompleted).toEqual(new Date(0));
  });

  it('should check if the event occurs after a given time', () => {
    const timeBefore = new Date(2023, 8, 15, 10, 0); // 10:00 AM
    const timeAfter = new Date(2023, 8, 15, 12, 0); // 12:00 PM
    expect(event.occursAfter(timeBefore)).toBe(true);
    expect(event.occursAfter(timeAfter)).toBe(false);
  });

  it('should check if the event was completed today', () => {
    event.markCompleted();
    expect(event.completedToday()).toBe(true);

    event.markIncomplete();
    expect(event.completedToday()).toBe(false);
  });

  it('should get createAtDescriptiom', () => {
    let description = event.createdAtDescription;
    let currentDate = new Date();
    const timeText = currentDate
            .toLocaleTimeString("en-AU", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
            })
            .toUpperCase();
        const dateText = currentDate.toDateString();
    expect(description).toBe(`${dateText} ${timeText}`);
  });

  it('should get export summary', () => {
    let summaryEvent = new PatientEvent(new UUID("randomid"), new Date("2021-12-12"), new Date("2021-12-15"), "testSummary", "test", 
    PatientEventCategory.other, new Date("2021-12-15"))
    summaryEvent.markCompleted();
    const summary = summaryEvent.getExportSummary();
    console.log(summary);
    expect(summary).toContain("randomid");
    expect(summary).toContain(summaryEvent.triggerTimeDescription);
    expect(summary).toContain("testSummary");
    expect(summary).toContain("test");
    expect(summary).toContain(summaryEvent.lastCompleted.toString());
  });
});
