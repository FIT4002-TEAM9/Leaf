/**
 * English strings.
 *
 * For the formatting convention, refer to my (Andre Pham's) repo:
 * https://github.com/Andre-Pham/yonder/blob/main/codebase/yonder/yonder/Strings/en.lproj/Localizable.strings
 *
 * For providing parameters, insert {0}, {1}, ..., {n} into the string.
 */
export default {
    // Main
    appName: "Intake",
    unknown: "Unknown",

    // Navigation
    "navigation.noScreen": "No item selected",

    // Worker Tab Bar
    "tabBar.worker.yourPatients": "Home",
    "tabBar.worker.newTriage": "Triage",
    "tabBar.worker.events": "Dashboard",
    "tabBar.worker.account": "Account",

    // Admin Tab Bar
    "tabBar.admin.nurses": "Nurses",
    "tabBar.admin.leaders": "Leaders",
    "tabBar.admin.new": "New",
    "tabBar.admin.export": "Export",

    // Leader Tab Bar
    "tabBar.leader.viewNurses": "Home",
    "tabBar.leader.viewPatients": "Patients",
    "tabBar.leader.account": "Account",

    // Worker Headers
    "header.worker.newTriage": "New Triage",
    "header.worker.events": "Events Dashboard",
    "header.worker.patients": "Patients",
    "header.worker.account": "Your Account",
    "header.worker.addEvent": "Add Event",
    "header.worker.view1Param": "{0} History",
    "header.worker.actions1Param": "Code {0} Responses",
    "header.worker.edit1Param": "Edit {0}",

    // Admin Headers
    "header.admin.manageNurses": "Home",
    "header.admin.viewNurses": "Nurses",
    "header.admin.viewLeaders": "Leaders",
    "header.admin.newAccount": "New Account",
    "header.admin.exportPatient": "Export Patient",

    // Leader Headers
    "header.leader.viewNurses": "Nurses",
    "header.leader.viewPatients": "Patients",
    "header.leader.allocatePatient": "Allocate Patient",
    "header.leader.nurses": "Nurses",

    // Buttons
    "button.login": "Login",
    "button.logout": "Logout",
    "button.done": "Done",
    "button.cancel": "Cancel",
    "button.edit": "edit",
    "button.allocate": "New Allocation",
    "button.deleteAccount": "Remove Account",
    "button.createAccount": "Create Account",
    "button.viewPatient": "View",
    "button.patientActions": "Actions",
    "button.editPatient": "Edit",
    "button.deletePatient": "Remove",
    "button.activateAccount": "Activate Account",
    "button.activate": "Activate",
    "button.clear": "Clear",
    "button.submit": "Submit",
    "button.addEvent": "Add Event",
    "button.exportPatient": "Export Patient",

    // Login
    "login.title": "Login",
    "login.activateAccount": "Activate Account",

    // Operations
    "operation.removeAccount": "This will remove this account and all associated data",
    "operation.activeAccount":
        "To activate the account and set the password, select 'Activate Account' on the login page.",

    // Labels
    "label.id": "ID: ",
    "label.loading": "Loading",
    "label.details": "Details",
    "label.viewPatient": "View patient information and medical history.",
    "label.patientActions": "View immediate actions relevant to triage.",
    "label.editPatient": "Edit patient information and triage.",
    "label.removePatient": "Delete patient from the system.",
    "label.addEvent": "Add a scheduled event for the patient.",
    "label.done": "Exit patient options.",
    "label.hospital": "Hospital",
    "label.rememberMe": "Remember Me",
    "label.editHospital": "Edit hospital",
    "label.editName": "Edit name",
    "label.editEmail": "Edit email",
    "label.enterPassword": "Enter password",
    "label.allocated": "Allocated",
    "label.all": "All",
    "label.category": "Category",
    "label.selectRole": "Select Role",
    "label.enterName": "Enter Name",
    "label.accountCreated": "Account Created",
    "label.anErrorOccurred": "An error occurred",
    "label.noEvents": "No Events",
    "label.accountCreated1Param": "{0} Account Created",

    // Input Labels
    "inputLabel.username": "Username",
    "inputLabel.providedUsername": "Assigned Username",
    "inputLabel.password": "Password",
    "inputLabel.setPassword": "Set Password",
    "inputLabel.confirmPassword": "Confirm Password",
    "inputLabel.givenName": "Name",
    "inputLabel.surname": "Surname",
    "inputLabel.mrn": "MRN",
    "inputLabel.postcode": "Postcode",
    "inputLabel.email": "Email",
    "inputLabel.setEmail": "Set Email",
    "inputLabel.triageCode": "Triage Code",
    "inputLabel.triageDescription": "Triage Description",
    "inputLabel.dob": "Date of Birth",
    "inputLabel.dateFormat": "DD/MM/YYYY",
    "inputLabel.timeFormat": "HH:MM - 24hr",
    "inputLabel.hopsital": "Hospital Site",
    "inputLabel.ward": "Ward",
    "inputLabel.medicalUnit": "Medical Unit",
    "inputLabel.required": "Required",
    "inputLabel.sex": "Sex",
    "inputLabel.phone": "Phone Number",
    "inputLabel.title": "Title",
    "inputLabel.description": "Description",
    "inputLabel.triggerTime": "Trigger Time",
    "inputLabel.category": "Category",

    // Triage Form
    "triageForm.title.identity": "Patient Identity",
    "triageForm.title.triage": "Triage",
    "triageForm.title.hospitalisation": "Hospitalisation",
    "triageForm.title.end": "End of Form",

    // Patient History
    "patientHistory.title.identity": "Identity",
    "patientHistory.title.bio": "Bio",
    "patientHistory.title.triage": "Triage Case",
    "patientHistory.title.events": "Events",

    // TODO: some of these strings have already been created, should I use the other ones even though the label doesnt really make sense?
    "patientHistory.descriptor.name": "Name",
    "patientHistory.descriptor.mrn": "MRN",
    "patientHistory.descriptor.postcode": "Postcode",
    "patientHistory.descriptor.dob": "Date of Birth",
    "patientHistory.descriptor.sex": "Sex",
    "patientHistory.descriptor.code": "Code",
    "patientHistory.descriptor.triageText": "Description",
    "patientHistory.descriptor.arrivalDate": "Arrival date",
    "patientHistory.descriptor.arrivalWard": "Arrival ward",
    "patientHistory.descriptor.dischargeDate": "Discharge date",
    "patientHistory.descriptor.dischargeWard": "Discharge ward",
    "patientHistory.descriptor.hospital": "Hospital",
    "patientHistory.descriptor.medicalUnit": "Medical Unit",
    "patientHistory.descriptor.category": "Category",
    "patientHistory.descriptor.triggerTime": "Time",

    // Actions
    "actions.emergency": "Emergency",
    "actions.call": "Call",
    "actions.steps": "Steps",
    "actions.department": "Department",

    // Search
    "search.underlying": "Search",

    // Triage Codes
    "triageCode.none": "None",
    "triageCode.1": "Immediate",
    "triageCode.2": "Emergency",
    "triageCode.3": "Urgent",
    "triageCode.4": "Semi-Urgent",
    "triageCode.5": "Non-Urgent",

    // Triage Steps
    // Immediate
    "triageCodeSteps.immediate.1": "Alert medical staff immediately",
    "triageCodeSteps.immediate.2": "Ensure constant visual surveillance",
    "triageCodeSteps.immediate.3": "Ensure adequate personnel to provide restraint",
    "triageCodeSteps.immediate.4": "Call security and/or police IF staff or patient safety is compromised",
    // Emergency
    "triageCodeSteps.emergency.1": "Alert medical staff immediately",
    "triageCodeSteps.emergency.2": "Ensure constant visual surveillance",
    "triageCodeSteps.emergency.3":
        "Ensure security in attendance to provide detention if necessary until patient is sedated",
    "triageCodeSteps.emergency.4": "If defusing techniques are unsuccessful, escalate to Code {0}",
    // Urgent
    "triageCodeSteps.urgent.1": "Close observation (regular observation at maximum of 10 minute intervals)",
    "triageCodeSteps.urgent.2": "Do not leave patient in waiting room without support staff",
    "triageCodeSteps.urgent.3": "Ensure safe environment for patient and others",
    "triageCodeSteps.urgent.4": "Inform security that patient is in department",
    "triageCodeSteps.urgent.5": "Re-triage if evidence of increasing behavioural disturbance",
    // Semi Urgent
    "triageCodeSteps.semiUrgent.1":
        "Intermittent observation (routine waiting room check at maximum of 1 hour intervals)",
    "triageCodeSteps.semiUrgent.2": "Discuss with mental health staff",
    "triageCodeSteps.semiUrgent.3": "Re-triage if evidence of increasing behavioural disturbance",
    // Non Urgent
    "triageCodeSteps.nonUrgent.1":
        "Intermittent observation (routine waiting room check at maximum of 1 hour intervals)",
    "triageCodeSteps.nonUrgent.2": "Discuss with mental health staff",

    // Roles
    "role.admin": "Admin",
    "role.leader": "Leader",
    "role.worker": "Nurse",

    // Shift Times
    "shiftTime.morning": "Morning",
    "shiftTime.afternoon": "Afternoon",
    "shiftTime.night": "Night",

    // Patient event categories
    "patientEventCategory.medication": "Medication",
    "patientEventCategory.other": "Other",

    // Sex
    "sex.male": "Male",
    "sex.female": "Female",
    "sex.other": "Other",

    // Errors
    "error.missingName": "Please enter both name and surname",
    "error.missingRole": "Please select the role",
    "error.hospitalExists": "Hospital does not exist",
    "error.incorrectPassword": "Incorrect password",
    "error.invalidDate": "Invalid date",
    "error.invalidTime": "Invalid time",

    // Sequence
    "sequence.documentName": "employeeIDSequences",
};
