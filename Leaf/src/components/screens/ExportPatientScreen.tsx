import {NavigationProp, ParamListBase} from "@react-navigation/native";
import {View} from "react-native";
import React, {useEffect, useState} from "react";
import {strings} from "../../localisation/Strings";
import Session from "../../model/session/Session";
import StateManager from "../../state/publishers/StateManager";
import DefaultScreenContainer from "./containers/DefaultScreenContainer";
import LeafButton from "../base/LeafButton/LeafButton";
import {LeafButtonType} from "../base/LeafButton/LeafButtonType";
import LeafTypography from "../styling/LeafTypography";
import LeafColors from "../styling/LeafColors";
import LeafDimensions from "../styling/LeafDimensions";
import LargeMenuButtonModified from "../custom/LargeMenuButtonModified";
import VGap from "../containers/layout/VGap";
import HStack from "../containers/HStack";
import VStack from "../containers/VStack";
import LeafSelectionItem from "../base/LeafListSelection/LeafSelectionItem";
import FormHeader from "../custom/FormHeader";
import Hospital from "../../model/hospital/Hospital";
import Ward from "../../model/hospital/Ward";
import MedicalUnit from "../../model/hospital/MedicalUnit";
import Worker from "../../model/employee/Worker";
import {HospitalArray} from "../../preset_data/Hospitals";
import {PatientSex} from "../../model/patient/PatientSex";
import {TriageCode} from "../../model/triage/TriageCode";
import LeafSelectionInputModified from "../base/LeafListSelection/LeafSelectionInputModified";
import TriageCodePickerModified from "../custom/TriageCodePickerModified";
import SexPicker from "../custom/SexPickerModified";
import axios from "axios";
import File from "../../model/file/File";
import {FileFilters} from "../../model/file/FileFilters";
import {useNotificationSession} from "../base/LeafDropNotification/NotificationSession";
import ExportPopup from "../custom/ExportPopup";
import LeafDateInput from "../base/LeafDateInput/LeafDateInput";
import {exportPatient} from "../../utils/ExportPatientUtil";
import Patient from "../../model/patient/Patient";

// Define the props for the ExportPatientScreen component
interface Props {
    navigation?: NavigationProp<ParamListBase>;
}

// Main component for exporting patient data
const ExportPatientScreen: React.FC<Props> = ({navigation}) => {
    // State variables for various selections and component states
    const [componentWidth, setComponentWidth] = useState(StateManager.contentWidth.read());
    const [selectedHospital, setSelectedHospital] = useState<LeafSelectionItem<Hospital> | undefined>();
    const [selectedWard, setSelectedWard] = useState<LeafSelectionItem<Ward> | undefined>();
    const [selectedMedicalUnit, setSelectedMedicalUnit] = useState<LeafSelectionItem<MedicalUnit> | undefined>();
    const [isCustomTileSelected, setIsCustomTileSelected] = useState<boolean>(false);
    const [workers, setWorkers] = useState<Worker[]>(Session.inst.getAllWorkers());
    const [filteredWorkers, setFilteredWorkers] = useState<Worker[]>(workers);
    const [selectedAssignedTo, setAssignedTo] = useState<LeafSelectionItem<Worker> | undefined>();
    const [selectedSexes, setSelectedSexes] = useState<PatientSex[]>([]);
    const activePatient = Session.inst.getActivePatient();
    const [triageCode, setTriageCode] = useState<TriageCode | undefined>(activePatient?.triageCase?.triageCode);
    const [selectedReportType, setSelectedReportType] = useState<string | undefined>();
    const [selectedButton, setSelectedButton] = useState<string | null>(null);
    const user = Session.inst.loggedInAccount;
    const {showErrorNotification, showSuccessNotification, showDefaultNotification} = useNotificationSession();
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [fromDateFilter, setFromDateFilter] = useState<Date | undefined>();
    const [toDateFilter, setToDateFilter] = useState<Date | undefined>(new Date());
    const [isFromDateValid, setIsFromDateValid] = useState(true);
    const [isToDateValid, setIsToDateValid] = useState(true);
    const [patients, setPatients] = useState<Patient[]>(Session.inst.getAllPatients());

    // useEffect for fetching patients and managing subscriptions to patient updates
    useEffect(() => {
        const unsubscribePatients = StateManager.patientsFetched.subscribe(() => {
            setPatients(Session.inst.getAllPatients());
        });

        // Fetch all patients when the component is mounted
        Session.inst.fetchAllPatients();

        // Cleanup: Unsubscribe from patientsFetched event when the component is unmounted
        return () => {
            unsubscribePatients();
        };
    }, []);

    // Handler for export button press
    const handleExportButtonPress = () => {
        if (selectedButton) {
            setPopupVisible(true);
        } else {
            showErrorNotification(strings("label.noReportSelected"));
        }
    }

    // Function to handle export from the popup
    const handleExport = async (title: string, password: string) => {
        // Call generateReport with title and password
        await generateReport(title, password);
    };

    // useEffect to handle fetching and updating workers data
    useEffect(() => {
        const unsubscribeWorkers = StateManager.workersFetched.subscribe(() => {
            setWorkers(Session.inst.getAllWorkers());
            setFilteredWorkers(Session.inst.getAllWorkers());
        });
        setComponentWidth(window.innerWidth - 264);

        // Fetch all workers when the component is mounted
        Session.inst.fetchAllWorkers();

        // Cleanup: Unsubscribe from workersFetched event when the component is unmounted
        return () => {
            unsubscribeWorkers();
        };
    }, []);

    // Helper function to determine the column count based on the component width
    const determineColumnCount = (width: number): number => {
        if (width < 365) {
            return 1;
        } else if (width < 520) {
            return 2;
        } else {
            return 3;
        }
    };

    const columnCount = determineColumnCount(componentWidth);
    const buttonSpacing = LeafDimensions.screenSpacing;
    const buttonWidth = (componentWidth - ((columnCount - 1) * buttonSpacing / 2)) / columnCount;

    // Handler for toggling the custom tile selection
    const handleCustomTileSelection = () => {
        setFromDateFilter(undefined)
        setIsFromDateValid(true)
        setToDateFilter(new Date())
        setIsToDateValid(true)
        setSelectedHospital(undefined);
        setSelectedWard(undefined);
        setSelectedMedicalUnit(undefined);
        setAssignedTo(undefined);
        setSelectedSexes([]);
        setTriageCode(undefined);
        setFromDateFilter(undefined)
        setIsCustomTileSelected(!isCustomTileSelected);
    };

    // Map worker data to LeafSelectionItems for rendering in the dropdowns
    const workerItems = workers.map((worker) => {
        return new LeafSelectionItem<Worker>(worker.fullName, worker.id.toString(), worker);
    });

    // Handle worker selection
    const handleWorkerSelection = (item: LeafSelectionItem<unknown> | undefined) => {
        setAssignedTo(item as LeafSelectionItem<Worker> | undefined);
    };

    // Handle patient sex (gender) selection
    const handleSexSelection = (sexes: PatientSex[]) => {
        setSelectedSexes(sexes);
    };

    // Handle report type selection
    const handleReportTypeSelection = (reportType: string) => {
        setSelectedReportType(reportType);
        console.log(`Selected report type: ${reportType}`);

        if (reportType === "Custom Report") {
            setIsCustomTileSelected(true);
        } else {
            setIsCustomTileSelected(false);
        }
    };

    // Handle button press and update selected button
    const handleButtonPress = (buttonLabel: string) => {
        if (selectedButton === buttonLabel) {
            // If the button is already selected, unselect it
            setSelectedButton(null);
            // Hide the form if the custom report button is unselected
            if (buttonLabel === "customReport") {
                setIsCustomTileSelected(false);
            }
        } else {
            // Otherwise, set it as the selected button
            setSelectedButton(buttonLabel);
            // Handle report type selection
            handleReportTypeSelection(buttonLabel);
        }
    };

    // Function to generate the report based on the selected report type and filters
    const generateReport = async (title: string, password: string) => {
        if (selectedReportType && selectedButton) {
            showDefaultNotification(strings("label.pleaseWait"), strings("label.generatingReport"), 'progress-download')

            // TODO - use as props for custom report
            const filters: FileFilters = {
                from_date: null,
                to_date: null,
                assigned_to: "",
                hospital_site: "",
                medical_unit: "",
                sex: "",
                triage_code: [],
                ward: "",
            };

            try {
                // Create file properties
                const author: string = user.fullName;
                const report_type: string = selectedReportType;
                const created: Date = new Date();

                if (selectedReportType === "Quick Report") {
                    console.log(patients);
                    const zip_file_id = await exportPatient(patients, title, password);

                    const file = new File(
                        zip_file_id["fileId"],
                        title,
                        author,
                        report_type,
                        password,
                        created,
                        filters
                    );
                    await Session.inst.submitNewFile(file);
                    showSuccessNotification(strings("feedback.successGenerateReport"));
                } else {
                    // Make the GET request to the Flask endpoint
                    const zip_file_id = await axios.get('http://127.0.0.1:5000/trigger', {
                        params: { title: title, password: password },
                    });

                    // Generate or fetch file_id
                    const file_id: string = zip_file_id.data["fileId"];
                    console.log(file_id);

                    // Create File object
                    const file = new File(
                        file_id,
                        title,
                        author,
                        report_type,
                        password,
                        created,
                        filters
                    );
                    // Set file in session or save to DB
                    await Session.inst.submitNewFile(file);
                    showSuccessNotification(strings("feedback.successGenerateReport"));
                }
            } catch
                (error) {
                console.error('Error generating the report', error);
                showErrorNotification(strings("feedback.failGenerateReport"));
            }
        } else {
            showErrorNotification(strings("label.noReportSelected"));
        }
    };

    return (
        <DefaultScreenContainer>
            <VStack spacing={LeafDimensions.screenSpacing} style={{flex: 1}}>
                <HStack
                    spacing={buttonSpacing}
                    style={{
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                    }}
                >
                    {/* Render large menu buttons */}
                    {[
                        {
                            label: strings("button.fullReport"),
                            description: strings("label.fullReport"),
                            onPress: () => setSelectedButton("fullReport"),
                            icon: "file-account-outline",
                        },
                        {
                            label: strings("button.quickReport"),
                            description: strings("label.quickReport"),
                            onPress: () => setSelectedButton("quickReport"),
                            icon: "file-clock-outline",
                        },
                        {
                            label: strings("button.customReport"),
                            description: strings("label.customReport"),
                            onPress: () => {
                                setSelectedButton("customReport");
                                handleCustomTileSelection();
                            },
                            icon: "file-edit-outline",
                        },
                    ].map((tile, index) => (
                        <LargeMenuButtonModified
                            key={index}
                            size={buttonWidth}
                            label={tile.label}
                            description={tile.description}
                            onPress={tile.onPress}
                            icon={tile.icon}
                            isSelected={selectedButton === tile.label}
                            onSelect={() => handleButtonPress(tile.label)}
                        />
                    ))}
                </HStack>

                {isCustomTileSelected && (
                    <VStack spacing={LeafDimensions.textInputSpacing} style={{width: "100%"}}>
                        <FormHeader
                            title={strings("triageForm.title.reportFilter")}
                            style={{paddingVertical: 24}}
                        />

                        <VStack spacing={LeafDimensions.textInputSpacing} style={{width: "100%"}}>
                            <HStack spacing={10} style={{display: 'flex', alignItems: 'center', width: '100%'}}>
                                <View style={{flex: 1}}>
                                    <LeafDateInput
                                        label={strings("label.fromDate")}
                                        onChange={(date) => {
                                            setFromDateFilter(date);
                                            setIsFromDateValid(date !== undefined);
                                        }}
                                        wide={true}
                                    />
                                </View>
                                <View style={{flex: 1}}>
                                    <LeafDateInput
                                        label={strings("label.toDate")}
                                        onChange={(date) => {
                                            setToDateFilter(date);
                                            setIsToDateValid(date !== undefined);
                                        }}
                                        initialValue={new Date()}
                                        wide={true}
                                    />
                                </View>
                            </HStack>
                            <LeafSelectionInputModified
                                navigation={navigation}
                                items={HospitalArray.map(hospital => new LeafSelectionItem(hospital.name, hospital.code, hospital))}
                                title={strings("inputLabel.hospital")}
                                selected={selectedHospital}
                                onSelection={(item: LeafSelectionItem<unknown> | undefined) => {
                                    setSelectedHospital(item as LeafSelectionItem<Hospital> | undefined);
                                    setSelectedMedicalUnit(undefined);
                                    setSelectedWard(undefined);
                                }}
                            />

                            <LeafSelectionInputModified
                                navigation={navigation}
                                items={selectedHospital === undefined ? [] : selectedHospital.value.wardsAsArray.map(ward => new LeafSelectionItem(ward.name, ward.hospitalCode, ward))}
                                title={strings("inputLabel.ward")}
                                selected={selectedWard}
                                disabled={selectedHospital === undefined}
                                onSelection={(item: LeafSelectionItem<unknown> | undefined) => {
                                    setSelectedWard(item as LeafSelectionItem<Ward> | undefined);
                                }}
                            />

                            <LeafSelectionInputModified
                                navigation={navigation}
                                items={selectedHospital === undefined ? [] : selectedHospital.value.medUnitsAsArray.map(medUnit => new LeafSelectionItem(medUnit.name, medUnit.group, medUnit))}
                                title={strings("inputLabel.medicalUnit")}
                                selected={selectedMedicalUnit}
                                disabled={selectedHospital === undefined}
                                onSelection={(item: LeafSelectionItem<unknown> | undefined) => {
                                    setSelectedMedicalUnit(item as LeafSelectionItem<MedicalUnit> | undefined);
                                }}
                            />

                            <LeafSelectionInputModified
                                navigation={navigation}
                                items={workerItems}
                                title={strings("inputLabel.assignedTo")}
                                selected={selectedAssignedTo}
                                onSelection={handleWorkerSelection}
                            />

                            <SexPicker
                                style={{paddingBottom: 8}}
                                onSelection={handleSexSelection}
                                initialValue={selectedSexes}
                            />

                            <TriageCodePickerModified
                                style={{paddingBottom: 8}}
                                onSelection={codes => setTriageCode(codes.length > 0 ? codes[0] : undefined)}
                                initialValue={triageCode ? [triageCode] : undefined}
                            />
                        </VStack>
                    </VStack>
                )}

                {/* Add the export button at the bottom */}
                <VGap size={12}/>
                <LeafButton
                    label="Export"
                    icon="file-export"
                    typography={LeafTypography.button}
                    type={LeafButtonType.Filled}
                    color={LeafColors.accent}
                    onPress={handleExportButtonPress}
                    disabled={isCustomTileSelected ?
                        !isFromDateValid || !isToDateValid : false
                    }
                />
            </VStack>
            <ExportPopup
                isVisible={isPopupVisible}
                onClose={() => setPopupVisible(false)}
                onExport={handleExport}
            />
        </DefaultScreenContainer>
    );
};

export default ExportPatientScreen;
