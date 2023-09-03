import { strings } from "../../localisation/Strings";

export class ShiftTime {
    // Morning shift, 7am - 3pm
    public static morning = new ShiftTime("MORNING");
    // Afternoon shift, 3pm - 11pm
    public static afternoon = new ShiftTime("AFTERNOON");
    // Night shift, 11pm - 7am
    public static night = new ShiftTime("AFTERNOON");

    public readonly id: string;

    constructor(id: string) {
        this.id = id.toUpperCase();
    }

    public matches(other: ShiftTime) {
        return this.id == other.id;
    }

    public toString(): string {
        if (this.matches(ShiftTime.morning)) {
            return strings("shiftTime.morning");
        }
        if (this.matches(ShiftTime.afternoon)) {
            return strings("shiftTime.afternoon");
        }
        if (this.matches(ShiftTime.night)) {
            return strings("shiftTime.night");
        }
        return strings("unknown");
    }
}
