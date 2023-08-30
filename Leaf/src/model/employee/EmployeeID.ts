import ID from "../core/ID";
import UUID from "../core/UUID";

class EmployeeID extends ID {
    private static lastGeneratedID: number = 0;

    constructor(code: string) {
        // TODO: Validation
        super(code);
    }

    public static generate(): EmployeeID {
        const length = 6;
        const maxJump = 5; //maximum jump interval
        const max = Math.pow(10, length) - 1;

        // take a random jump interval
        const jump = Math.floor(Math.random() * maxJump) + 1;
        // Calculate new ID with jump interval
        EmployeeID.lastGeneratedID += jump;
        // If max ID value is reached
        if (EmployeeID.lastGeneratedID > max) {
            //TODO: Do we need a way to solve this now?
            throw new Error("You have reached the max EmployeeID value!");
        }
        return new EmployeeID(EmployeeID.lastGeneratedID.toString().padStart(length, "0"));
    }

    public matches(other: EmployeeID): boolean {
        return this.toString() == other.toString();
    }
}

export default EmployeeID;
