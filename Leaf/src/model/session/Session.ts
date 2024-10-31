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
import NewTriageManager from "./NewTriageManager";
import { Role } from "../employee/Role";
import { LoginStatus } from "../../state/publishers/types/LoginStatus";
import AccountsManager from "./AccountsManager";
import Account from "../account/Account";
import { assertionFailure } from "../../language/assertions/AssertionFailsure";
import NewFileManager from "./NewFileManager";
import File from "../file/File";
import FileManager from "./FileManager";

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
     // ALl workers (continuously updated from database fetches) [ID: Worker]
    private _fileStore: { [key: string]: File } = {};

    public get loggedInAccount(): Employee {
        if (this._loggedInAccount == null) {
            // If we are calling this when no one is logged in, something is seriously wrong
            // Just bail - logout and return a dummy account
            StateManager.loginStatus.publish(LoginStatus.LoggedOut);
            return Worker.new("", "", null);
        }
        return this._loggedInAccount;
    }

    private constructor() {}

    public async submitTriage(patient: Patient): Promise<boolean> {
        // When you triage a new patient, you are allocating them to yourself
        patient.changelog.logAllocation(this.loggedInAccount.id, this.loggedInAccount.id);
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
        activePatient.addEvent(event);
        activePatient.changelog.logEventCreation(event.id, this.loggedInAccount.id);
        const success = await PatientsManager.inst.updatePatient(activePatient);
        if (success) {
            // If we successfully submitted the event, re-fetch them from the database
            // This keeps Session up to date with the latest patient instance
            this.fetchPatient(activePatient.mrn);
        }
        return success;
    }

    public async markPatientEvent(patient: Patient, event: PatientEvent, completed: boolean): Promise<boolean> {
        if (completed) {
            event.markCompleted();
        } else {
            event.markIncomplete();
        }
        patient.changelog.logEventCompletion(event.id, this.loggedInAccount.id, completed);
        const success = await PatientsManager.inst.updatePatient(patient);
        if (success) {
            // If we successfully marked the event, re-fetch them from the database
            // This keeps Session up to date with the latest patient instance
            this.fetchPatient(patient.mrn);
        }
        return success;
    }

    public async allocatePatient(patient: Patient, allocatedTo: Worker): Promise<boolean> {
        const allocatedPatients = this.getAllocatedPatientsTo(allocatedTo);
        for (const patientOfWorker of allocatedPatients) {
            if (patientOfWorker.mrn.matches(patient.mrn)) {
                return false;
            }
        }
        patient.allocateTo(allocatedTo.id);
        patient.changelog.logAllocation(this.loggedInAccount.id, allocatedTo.id);
        const success2 = await this.updatePatient(patient);
        if (!success2) {
            return false;
        } else {
            // If we successfully submitted, re-fetch them from the database
            await this.fetchAllocatedPatientsTo(allocatedTo);
        }
        return success2;
    }

    public async unallocatePatient(patient: Patient, allocatedTo: Worker): Promise<boolean> {
        patient.deallocate();
        const success2 = await this.updatePatient(patient);
        if (!success2) {
            return false;
        } else {
            await this.fetchAllocatedPatientsTo(allocatedTo);
        }
        return success2;
    }

    // This is used when a worker edits a patient
    // NOT to be mixed up by updatePatient, which is a generic method to update a patient in the database
    public async editPatient(patient: Patient): Promise<boolean> {
        patient.changelog.logEdit(this.loggedInAccount.id);
        const success = this.updatePatient(patient);
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

    // This is used as a generic method to update a patient in the database
    // NOT to be mixed up with editPatient, which is used when a worker edits a patient
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

    public async deletePatient(patient: Patient): Promise<boolean> {
        const success = await PatientsManager.inst.deletePatient(patient);
        if (success) {
            delete this._patientStore[patient.mrn.toString()];
            // Notify components that display patients to refresh
            StateManager.patientsFetched.publish();
        }
        return success;
    }

    public async deleteWorker(worker: Worker): Promise<boolean> {
        const success = await WorkersManager.inst.deleteWorker(worker);
        if (success) {
            delete this._workerStore[worker.id.toString()];
            // Notify components that display workers to refresh
            StateManager.workersFetched.publish();
        }
        return success;
    }

    public async deleteLeader(leader: Leader): Promise<boolean> {
        const success = await LeadersManager.inst.deleteLeader(leader);
        if (success) {
            delete this._leaderStore[leader.id.toString()];
            // Notify components that display leaders to refresh
            StateManager.leadersFetched.publish();
        }
        return success;
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

    public getAllFiles(): File[] {
        return Object.values(this._fileStore);
    }

    public getAllHashedWorkers(): { [key: string]: Worker } {
        return { ...this._workerStore };
    }

    public getWorker(id: EmployeeID): Worker | null {
        return this._workerStore[id.toString()] || null;
    }

    public getAllLeaders(): Leader[] {
        return Object.values(this._leaderStore);
    }

    public getAllHashedLeaders(): { [key: string]: Leader } {
        return { ...this._leaderStore };
    }

    public getLeader(id: EmployeeID): Leader | null {
        return this._leaderStore[id.toString()] || null;
    }

    public getAllPatients(): Patient[] {
        return Object.values(this._patientStore);
    }

    public getAllHashedPatients(): { [key: string]: Patient } {
        return { ...this._patientStore };
    }

    public getAllocatedPatients(): Patient[] {
        if (this.loggedInAccount.role.matches(Role.worker)) {
            return this.getAllocatedPatientsTo(this.loggedInAccount as Worker);
        }
        return [];
    }

    public getAllocatedPatientsTo(worker: Worker): Patient[] {
        return Object.values(this._patientStore).filter((patient) => patient.idAllocatedTo?.matches(worker.id));
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
        // Invalidate cache, since we're restoring all workers, and some may have been deleted
        this._workerStore = {};
        // Cache workers
        for (const worker of workers) {
            this._workerStore[worker.id.toString()] = worker;
        }
        // Notify subscribers
        StateManager.workersFetched.publish();
    }

    public async fetchAllFiles() {
        // Restore files from the database
        const files = await FileManager.inst.getFiles();
        // Invalidate cache, since we're restoring all files, and some may have been deleted
        this._fileStore = {};
        // Cache files
        for (const file of files) {
            this._fileStore[file.id.toString()] = file;
        }
        // Notify subscribers
        StateManager.filesFetched.publish();
    }

    public async fetchWorker(id: EmployeeID) {
        const worker = await WorkersManager.inst.getWorker(id);
        if (worker != null) {
            this._workerStore[worker.id.toString()] = worker;
        } else {
            delete this._workerStore[id.toString()];
        }
        // Notify subscribers
        StateManager.workersFetched.publish();
    }

    public async fetchAllLeaders() {
        // Restore leaders from the database
        const leaders = await LeadersManager.inst.getLeaders();
        // Invalidate cache, since we're restoring all leaders, and some may have been deleted
        this._leaderStore = {};
        // Cache leaders
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
        } else {
            delete this._leaderStore[id.toString()];
        }
        // Notify subscribers
        StateManager.leadersFetched.publish();
    }

    public async fetchAllPatients() {
        const patients = await PatientsManager.inst.getPatients();
        // Invalidate cache, since we're restoring all patients, and some may have been deleted
        this._patientStore = {};
        // Cache patients
        for (const patient of patients) {
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
        const workerAllocatedTo = this.loggedInAccount as Worker;
        const patients = await PatientsManager.inst.getPatientsAllocatedTo(workerAllocatedTo);
        // Invalidate cache since some may have been deleted
        for (const patient of this.getAllPatients()) {
            if (patient.idAllocatedTo?.matches(workerAllocatedTo.id) ?? false) {
                delete this._patientStore[patient.mrn.toString()];
            }
        }
        for (const patient of patients) {
            this._patientStore[patient.mrn.toString()] = patient;
        }
        // Notify subscribers that patients have been fetched
        StateManager.patientsFetched.publish();
    }

    public async fetchAllocatedPatientsTo(worker: Worker) {
        const patients = await PatientsManager.inst.getPatientsAllocatedTo(worker);
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
        } else {
            delete this._patientStore[mrn.toString()];
        }
        // Notify subscribers
        StateManager.patientsFetched.publish();
    }

    public async fetchAccount(id: EmployeeID): Promise<Account | null> {
        const account = await AccountsManager.inst.getAccount(id);
        return account;
    }

    public async activateNewAccount(account: Account): Promise<boolean> {
        return AccountsManager.inst.newAccountCreated(account);
    }

    public async updateAccount(account: Account): Promise<boolean> {
        return AccountsManager.inst.updateAccount(account);
    }

    public async submitNewFile(file: File): Promise<boolean> {
        return NewFileManager.inst.newFileCreated(file);
    }
}

export default Session;
