import StateManager from "../../state/publishers/StateManager";
import Admin from "../employee/Admin";
import Employee from "../employee/Employee";
import EmployeeID from "../employee/EmployeeID";
import Leader from "../employee/Leader";
import Worker from "../employee/Worker";
import MRN from "../patient/MRN";
import Patient from "../patient/Patient";
import PatientEvent from "../patient/PatientEvent";
import AdminsManager from "./AdminsManager";
import LeadersManager from "./LeadersManager";
import PatientsManager from "./PatientsManager";
import WorkersManager from "./WorkersManager";
import NewEmployeeManager from "./NewEmployeeManager";
import NewPatientEventManager from "./NewPatientEventManager";
import NewTriageManager from "./NewTriageManager";
import { Role } from "../employee/Role";
import { LoginStatus } from "../../state/publishers/types/LoginStatus";

class Session {
    public static readonly inst = new Session();

    /*
        STORE DOCUMENTATION (workerStore, leaderStore, patientStore)

        The stores are continuously updated dictionaries of content retrieved
        from the database. They don't represent a certain selection of objects,
        they act as a cache to have faster response times.

        When I say that they don't represent a certain selection of objects, it
        means (for example) the patientStore doesn't represent all patients, or 
        any specific selection of patients. It's just all/any patients that have 
        been retrieved up to now that may come in handy (show up) later.

        This means when we open a page that shows patients, we can instantly
        show all relevant patients we've retrieved up to now because they're 
        already in memory. We still do a fetch from the database and update the 
        list when the fetch is complete, but it feels much more seamless to open 
        a list of patients instantly that then adds the most recent patients 
        after a second of loading than to open an empty page of patients and 
        have to wait, every. single. time.

        It also means stuff that hasn't changed appears instantly. If you have
        patients allocated to you, and you've fetched them already, next time
        you open that page it instantly shows the cached patients and since your 
        list is unchanged, the fetch doesn't change anything, making it appear 
        as though we fetched them instantly.
    */

    // The account (employee) currently logged in
    private _loggedInAccount: Employee | null = null;
    // ALl workers (continuously updated from database fetches) [ID: Worker]
    private _workerStore: { [key: string]: Worker } = {};
    // All patients (continuously updated from database fetches) [MRN: Patient]
    private _patientStore: { [key: string]: Patient } = {};
    // All leaders (continuously updated from database fetches) [ID: Leader]
    private _leaderStore: { [key: string]: Leader } = {};
    // The mrn of the patient currently being previewed within app (any screen)
    private _activePatientMRN: MRN | null = null;
    // The id of the worker currently being previewed within the app (any screen)
    private _activeWorkerID: EmployeeID | null = null;
    // The id of the leader currently being previewed within the app (any screen)
    private _activeLeaderID: EmployeeID | null = null;

    public get loggedInAccount(): Employee {
        if (this._loggedInAccount == null) {
            // If we are calling this when no one is logged in, something is seriously wrong
            // Just bail - logout and return a dummy account
            StateManager.loginStatus.publish(LoginStatus.LoggedOut);
            return Worker.new(new EmployeeID((EmployeeID.generate()).toString()), "", "", null);
        }
        return this._loggedInAccount;
    }

    private constructor() {}

    public async submitTriage(patient: Patient): Promise<boolean> {
        return NewTriageManager.inst.newTriageSubmitted(patient);
    }

    public async submitPatientEvent(event: PatientEvent): Promise<boolean> {
        if (!this._activePatientMRN) {
            console.error("[SESSION] Failed to submit patient event - active patient is null");
            return false;
        }
        const activePatient = this.getActivePatient();
        if (activePatient == null) {
            return false;
        }
        const success = await NewPatientEventManager.inst.newPatientEventSubmitted(activePatient, event);
        if (success) {
            // If we successfully submitted the event, re-fetch them from the database
            // This keeps Session up to date with the latest patient instance
            this.fetchPatient(activePatient.mrn);
        }
        return success;
    }

    public async submitNewWorker(worker: Worker): Promise<boolean> {
        return NewEmployeeManager.inst.newWorkerCreated(worker);
    }

    public async submitNewAdmin(admin: Admin): Promise<boolean> {
        return NewEmployeeManager.inst.newAdminCreated(admin);
    }

    public async submitNewLeader(leader: Leader): Promise<boolean> {
        return NewEmployeeManager.inst.newLeaderCreated(leader);
    }

    public async updatePatient(patient: Patient): Promise<boolean> {
        const success = await PatientsManager.inst.updatePatient(patient);
        if (success) {
            StateManager.patientUpdated.publish();
        }
        return success;
    }

    public async updateWorker(worker: Worker): Promise<boolean> {
        return WorkersManager.inst.updateWorker(worker);
    }

    public async updateAdmin(admin: Admin): Promise<boolean> {
        return AdminsManager.inst.updateAdmin(admin);
    }

    public async updateLeader(leader: Leader): Promise<boolean> {
        return LeadersManager.inst.updateLeader(leader);
    }

    public setLoggedInAccount(employee: Employee) {
        this._loggedInAccount = employee;
    }

    public setActivePatient(patient: Patient | null) {
        this._activePatientMRN = patient?.mrn ?? null;
        StateManager.activePatientChanged.publish();
        if (patient != null) {
            this._patientStore[patient.mrn.toString()] = patient;
        }
    }

    public setActiveWorker(worker: Worker | null) {
        this._activeWorkerID = worker?.id ?? null;
        StateManager.activeWorkerChanged.publish();
        if (worker != null) {
            this._workerStore[worker.id.toString()] = worker;
        }
    }

    public setActiveLeader(leader: Leader | null) {
        this._activeLeaderID = leader?.id ?? null;
        StateManager.activeLeaderChanged.publish();
        if (leader != null) {
            this._leaderStore[leader.id.toString()] = leader;
        }
    }

    public getActivePatient(): Patient | null {
        const key = this._activePatientMRN?.toString();
        if (key) {
            return this._patientStore[key] ?? null;
        } else {
            return null;
        }
    }

    public getActiveWorker(): Worker | null {
        const key = this._activeWorkerID?.toString();
        if (key) {
            return this._workerStore[key] ?? null;
        } else {
            return null;
        }
    }

    public getActiveLeader(): Leader | null {
        const key = this._activeLeaderID?.toString();
        if (key) {
            return this._leaderStore[key] ?? null;
        } else {
            return null;
        }
    }

    public getAllWorkers(): Worker[] {
        return Object.values(this._workerStore);
    }

    public getWorker(id: EmployeeID): Worker | null {
        return this._workerStore[id.toString()] || null;
    }

    public getAllLeaders(): Leader[] {
        return Object.values(this._leaderStore);
    }

    public getLeader(id: EmployeeID): Leader | null {
        return this._leaderStore[id.toString()] || null;
    }

    public getAllPatients(): Patient[] {
        return Object.values(this._patientStore);
    }

    public getAllocatedPatients(): Patient[] {
        return Object.values(this._patientStore).filter((patient) =>
            patient.idAllocatedTo.matches(this.loggedInAccount.id),
        );
    }

    public getPatient(id: MRN): Patient | null {
        return this._patientStore[id.toString()] || null;
    }

    public async getAdmin(id: MRN): Promise<Admin | null> {
        const admin = await AdminsManager.inst.getAdmin(id);
        return admin;
    }

    public async fetchAllWorkers() {
        // Restore workers from the database
        const workers = await WorkersManager.inst.getWorkers();
        for (const worker of workers) {
            this._workerStore[worker.id.toString()] = worker;
        }
        // Notify subscribers
        StateManager.workersFetched.publish();
    }

    public async fetchWorker(id: EmployeeID) {
        const worker = await WorkersManager.inst.getWorker(id);
        if (worker != null) {
            this._workerStore[worker.id.toString()] = worker;
        }
        // Notify subscribers
        StateManager.workersFetched.publish();
    }

    public async fetchAllLeaders() {
        // Restore leaders from the database
        const leaders = await LeadersManager.inst.getLeaders();
        for (const leader of leaders) {
            this._leaderStore[leader.id.toString()] = leader;
        }
        // Notify subscribers
        StateManager.leadersFetched.publish();
    }

    public async fetchLeader(id: EmployeeID) {
        const leader = await LeadersManager.inst.getLeader(id);
        if (leader != null) {
            this._leaderStore[leader.id.toString()] = leader;
        }
        // Notify subscribers
        StateManager.leadersFetched.publish();
    }

    public async fetchAllPatients() {
        const patients = await PatientsManager.inst.getPatients();
        for (const patient of patients) {
            // No duplicates due to use of dictionary
            this._patientStore[patient.mrn.toString()] = patient;
        }
        // Notify subscribers that patients have been fetched
        StateManager.patientsFetched.publish();
    }

    /**
     * Fetch the patients that are allocated to the account logged in
     */
    public async fetchAllocatedPatients() {
        if (!this.loggedInAccount.role.matches(Role.worker)) {
            // Patients can only be allocated to workers
            return;
        }
        const patients = await PatientsManager.inst.getPatientsAllocatedTo(this.loggedInAccount as Worker);
        for (const patient of patients) {
            // No duplicates due to use of dictionary
            this._patientStore[patient.mrn.toString()] = patient;
        }
        // Notify subscribers that patients have been fetched
        StateManager.patientsFetched.publish();
    }

    public async fetchPatient(mrn: MRN) {
        const patient = await PatientsManager.inst.getPatient(mrn);
        if (patient != null) {
            this._patientStore[patient.mrn.toString()] = patient;
        }
        // Notify subscribers
        StateManager.patientsFetched.publish();
    }
}

export default Session;
