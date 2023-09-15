import ChangelogPoint from "../src/model/patient/ChangelogPoint";
import UUID from "../src/model/core/UUID";

describe('ChangelogPoint', () => {
  it('should generate dateDescription correctly', () => {
    const date = new Date("2023-09-15T10:30:00Z");
    const description = "Sample description";
    const changelogPoint = new ChangelogPoint(date, description, UUID.generate());

    // const expectedDateDescription = new Date("2023-09-15T10:30:00Z");
    const timeText = new Date("2023-09-15T10:30:00Z")
            .toLocaleTimeString("en-AU", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
            })
            .toUpperCase();
    const dateText = new Date("2023-09-15T10:30:00Z").toDateString();
    const expectedDateDescription = `${timeText}\n${dateText}`;
    expect(changelogPoint.dateDescription).toBe(expectedDateDescription);
  });

  it('should create a new ChangelogPoint', () => {
    const date = new Date();
    const description = "Sample description";
    const changelogPoint = ChangelogPoint.new(date, description);

    // Check if the date and description are set correctly
    expect(changelogPoint.date).toBe(date);
    expect(changelogPoint.description).toBe(description);

    // Check if id is a valid UUID
    const validUUIDPattern =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
    expect(validUUIDPattern.test(changelogPoint.id.toString())).toBe(true);
  });
});
