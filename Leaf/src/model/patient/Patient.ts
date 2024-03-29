import EmployeeID from "../employee/EmployeeID";
import { ShiftTime } from "../employee/ShiftTime";
import Hospital from "../hospital/Hospital";
import MedicalUnit from "../hospital/MedicalUnit";
import Ward from "../hospital/Ward";
import TriageCase from "../triage/TriageCase";
import { TriageCode } from "../triage/TriageCode";
import MRN from "./MRN";
import PatientChangelog from "./PatientChangelog";
import PatientEvent from "./PatientEvent";
import { PatientSex } from "./PatientSex";

class Patient {
    protected _mrn: MRN;
    protected _dob: Date;
    protected _firstName: string;
    protected _lastName: string;
    protected _sex: PatientSex;
    protected _phoneNumber: string;
    protected _triageCase: TriageCase;
    protected _postCode: string;
    protected _timeLastAllocated: Date | null;
    protected _allocatedTo: EmployeeID | null;
    protected _events: PatientEvent[];
    protected _changelog: PatientChangelog;
    get mrn(): MRN {
        return this._mrn;
    }
    get dob(): Date {
        return this._dob;
    }
    get firstName(): string {
        return this._firstName;
    }
    get lastName(): string {
        return this._lastName;
    }
    get fullName(): string {
        return `${this._firstName} ${this._lastName}`;
    }
    get sex(): PatientSex {
        return this._sex;
    }
    get phoneNumber(): string {
        return this._phoneNumber;
    }
    get triageCase(): TriageCase {
        return this._triageCase;
    }
    get postCode(): string {
        return this._postCode;
    }
    get timeLastAllocated(): Date | null {
        return this._timeLastAllocated;
    }
    get idAllocatedTo(): EmployeeID | null {
        return this._allocatedTo;
    }
    get events(): PatientEvent[] {
        return this._events;
    }
    get sessionAllocated(): ShiftTime {
        return ShiftTime.getCurrent(this._timeLastAllocated);
    }
    get changelog(): PatientChangelog {
        return this._changelog;
    }

    constructor(
        mrn: MRN,
        dob: Date,
        firstName: string,
        lastName: string,
        sex: PatientSex,
        phoneNumber: string,
        triageCase: TriageCase,
        postCode: string,
        timeLastAllocated: Date | null,
        allocatedTo: EmployeeID | null,
        events: PatientEvent[],
        changelog: PatientChangelog,
    ) {
        this._mrn = mrn;
        this._dob = dob;
        this._firstName = firstName;
        this._lastName = lastName;
        this._sex = sex;
        this._phoneNumber = phoneNumber;
        this._triageCase = triageCase;
        this._postCode = postCode;
        this._timeLastAllocated = timeLastAllocated;
        this._allocatedTo = allocatedTo;
        this._events = events;
        this._changelog = changelog;
    }

    public static new(
        mrn: MRN,
        dob: Date,
        firstName: string,
        lastName: string,
        sex: PatientSex,
        phoneNumber: string,
        triageCase: TriageCase,
        postCode: string,
        allocatedTo: EmployeeID | null,
    ): Patient {
        return new Patient(
            mrn,
            dob,
            firstName,
            lastName,
            sex,
            phoneNumber,
            triageCase,
            postCode,
            new Date(),
            allocatedTo,
            [],
            PatientChangelog.new(),
        );
    }

    public addEvent(event: PatientEvent) {
        this._events.push(event);
    }

    public allocateTo(employeeID: EmployeeID) {
        this._allocatedTo = employeeID;
        this._timeLastAllocated = new Date();
    }

    public deallocate() {
        this._allocatedTo = null;
    }

    public editTriage(ward: Ward, hospital: Hospital, unit: MedicalUnit, description: string, code: TriageCode) {
        this._triageCase = TriageCase.new(ward, hospital, unit, description, code);
    }
}

export default Patient;
