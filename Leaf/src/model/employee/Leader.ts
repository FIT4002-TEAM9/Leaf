import Hospital from "../hospital/Hospital";
import Employee from "./Employee";
import EmployeeID from "./EmployeeID";
import { Role } from "./Role";

class Leader extends Employee {
    public readonly role: Role = Role.leader;

    public static new(firstName: string, lastName: string, hospital: Hospital | null): Leader {
        return new Leader(EmployeeID.generate(), firstName, lastName, null, hospital, false);
    }
}

export default Leader;
