import Employee from "./Employee";
import EmployeeID from "./EmployeeID";
import { Role } from "./Role";

class Admin extends Employee {
    public readonly role: Role = Role.admin;

    public static new(id: EmployeeID, firstName: string, lastName: string): Admin {
        return new Admin(id, firstName, lastName, null, null, false);
    }
}

export default Admin;
