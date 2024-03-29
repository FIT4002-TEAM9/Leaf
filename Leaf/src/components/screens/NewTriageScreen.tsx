import { NavigationProp, ParamListBase } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { strings } from "../../localisation/Strings";
import Hospital from "../../model/hospital/Hospital";
import MedicalUnit from "../../model/hospital/MedicalUnit";
import Ward from "../../model/hospital/Ward";
import { HospitalArray } from "../../preset_data/Hospitals";
import LeafButton from "../base/LeafButton/LeafButton";
import LeafDateInput from "../base/LeafDateInput/LeafDateInput";
import LeafSelectionInput from "../base/LeafListSelection/LeafSelectionInput";
import LeafSelectionItem from "../base/LeafListSelection/LeafSelectionItem";
import LeafMultilineTextInput from "../base/LeafMultilineTextInput/LeafMultilineTextInput";
import LeafTextInput from "../base/LeafTextInput/LeafTextInput";
import HStack from "../containers/HStack";
import VStack from "../containers/VStack";
import FormHeader from "../custom/FormHeader";
import TriageCodePicker from "../custom/TriageCodePicker";
import LeafColors from "../styling/LeafColors";
import LeafDimensions from "../styling/LeafDimensions";
import StateManager from "../../state/publishers/StateManager";
import LeafTypography from "../styling/LeafTypography";
import { TriageCode } from "../../model/triage/TriageCode";
import ValidateUtil from "../../utils/ValidateUtil";
import Patient from "../../model/patient/Patient";
import MRN from "../../model/patient/MRN";
import LeafSegmentedButtons from "../base/LeafSegmentedButtons/LeafSegmentedButtons";
import { PatientSex } from "../../model/patient/PatientSex";
import LeafSegmentedValue from "../base/LeafSegmentedButtons/LeafSegmentedValue";
import TriageCase from "../../model/triage/TriageCase";
import Session from "../../model/session/Session";
import KeyboardAwareScreenContainer from "./containers/KeyboardAwareScreenContainer";
import NavigationSession from "../navigation/state/NavigationEnvironment";
import { useNotificationSession } from "../base/LeafDropNotification/NotificationSession";

interface Props {
    navigation?: NavigationProp<ParamListBase>;
}

const NewTriageScreen: React.FC<Props> = ({ navigation }) => {
    const { showErrorNotification, showSuccessNotification } = useNotificationSession();
    const activePatient = Session.inst.getActivePatient();
    const patientHospital = activePatient?.triageCase.hospital;
    const patientWard = activePatient?.triageCase.arrivalWard;
    const patientUnit = activePatient?.triageCase.medicalUnit;

    const editPatientMode = activePatient != undefined;

    const [selectedHospital, setSelectedHospital] = useState<LeafSelectionItem<Hospital> | undefined>(
        patientHospital != undefined
            ? new LeafSelectionItem(patientHospital.name, patientHospital.code, patientHospital)
            : undefined,
    );
    const [selectedWard, setSelectedWard] = useState<LeafSelectionItem<Ward> | undefined>(
        patientWard != undefined
            ? new LeafSelectionItem(patientWard.name, patientWard.hospitalCode, patientWard)
            : undefined,
    );
    const [selectedMedicalUnit, setSelectedMedicalUnit] = useState<LeafSelectionItem<MedicalUnit> | undefined>(
        patientUnit != undefined ? new LeafSelectionItem(patientUnit.name, patientUnit.group, patientUnit) : undefined,
    );

    const [sex, setSex] = React.useState<LeafSegmentedValue | undefined>(
        editPatientMode ? new LeafSegmentedValue(activePatient.sex, activePatient.sex.toString()) : undefined,
    );
    const [givenName, setGivenName] = useState<string | undefined>(activePatient?.firstName);
    const [surname, setSurname] = useState<string | undefined>(activePatient?.lastName);
    const [mrn, setMRN] = useState<string | undefined>(activePatient?.mrn.toString());
    const [postcode, setPostcode] = useState<string | undefined>(activePatient?.postCode);
    const [phone, setPhone] = useState<string | undefined>(activePatient?.phoneNumber);
    const [dob, setDOB] = useState<Date | undefined>(activePatient?.dob);
    const [triageCode, setTriageCode] = useState<TriageCode | undefined>(activePatient?.triageCase?.triageCode);
    const [triageDescription, setTriageDescription] = useState<string | undefined>(
        activePatient?.triageCase?.triageText,
    );

    const sexIsValid: () => boolean = () => {
        return ValidateUtil.valueIsDefined(sex);
    };
    const givenNameIsValid: () => boolean = () => {
        return ValidateUtil.stringIsValid(givenName);
    };
    const surnameNameIsValid: () => boolean = () => {
        return ValidateUtil.stringIsValid(surname);
    };
    const mrnIsValid: () => boolean = () => {
        return ValidateUtil.mrnIsValid(mrn);
    };
    const postcodeIsValid: () => boolean = () => {
        return ValidateUtil.postcodeIsValid(postcode);
    };
    const phoneIsValid: () => boolean = () => {
        return ValidateUtil.phoneNumberIsValid(phone);
    };
    const dobIsValid: () => boolean = () => {
        return ValidateUtil.dobIsValid(dob);
    };
    const triageCodeIsValid: () => boolean = () => {
        return ValidateUtil.valueIsDefined(triageCode);
    };
    const triageDescriptionIsValid: () => boolean = () => {
        return ValidateUtil.stringIsValid(triageDescription);
    };
    const hospitalIsValid: () => boolean = () => {
        return ValidateUtil.valueIsDefined(selectedHospital);
    };
    const wardIsValid: () => boolean = () => {
        return ValidateUtil.valueIsDefined(selectedWard);
    };
    const medicalUnitIsValid: () => boolean = () => {
        return ValidateUtil.valueIsDefined(selectedMedicalUnit);
    };

    const allIsValid: () => boolean = () => {
        return (
            sexIsValid() &&
            givenNameIsValid() &&
            surnameNameIsValid() &&
            mrnIsValid() &&
            postcodeIsValid() &&
            phoneIsValid() &&
            dobIsValid() &&
            triageCodeIsValid() &&
            triageDescriptionIsValid() &&
            hospitalIsValid() &&
            wardIsValid() &&
            medicalUnitIsValid()
        );
    };

    // Should refactor and split up this func? Has become quite ugly.
    const onSubmit = async () => {
        if (allIsValid()) {
            // We force-unwrap everything because we assume everything is validated already
            // If allIsValid() is every removed, TAKE OUT THE FORCE UNWRAPS
            // Otherwise this WILL cause errors
            if (activePatient == undefined) {
                const patient = Patient.new(
                    new MRN(mrn!),
                    dob!,
                    givenName!,
                    surname!,
                    sex!.value,
                    phone!,
                    TriageCase.new(
                        selectedWard!.value,
                        selectedHospital!.value,
                        selectedMedicalUnit!.value,
                        triageDescription!,
                        triageCode!,
                    ),
                    postcode!,
                    Session.inst.loggedInAccount.id,
                );
                const successful = await Session.inst.submitTriage(patient);
                if (successful) {
                    showSuccessNotification(strings("feedback.triageCreated"));
                    StateManager.clearAllInputs.publish();
                    Session.inst.fetchPatient(patient.mrn);
                } else {
                    showErrorNotification(strings("feedback.triageNotCreated"));
                }
            } else {
                const patient = new Patient(
                    new MRN(mrn!),
                    dob!,
                    givenName!,
                    surname!,
                    sex!.value,
                    phone!,
                    TriageCase.new(
                        selectedWard!.value,
                        selectedHospital!.value,
                        selectedMedicalUnit!.value,
                        triageDescription!,
                        triageCode!,
                    ),
                    postcode!,
                    activePatient.timeLastAllocated,
                    activePatient.idAllocatedTo,
                    activePatient.events,
                    activePatient.changelog,
                );
                const successful = await Session.inst.editPatient(patient);
                // TODO: activity indicator?
                if (successful) {
                    showSuccessNotification(strings("feedback.patientEdited"));
                    NavigationSession.inst.navigateBack(navigation);
                    Session.inst.fetchPatient(activePatient.mrn);
                } else {
                    showErrorNotification(strings("feedback.patientNotEdited"));
                }
            }
        } else {
            showErrorNotification(strings("feedback.invalidInputs"));
        }
    };

    const formPadding = 24;

    return (
        <KeyboardAwareScreenContainer>
            <VStack>
                <FormHeader title={strings("triageForm.title.identity")} style={{ paddingBottom: formPadding }} />

                <VStack spacing={LeafDimensions.textInputSpacing} style={{ width: "100%" }}>
                    <LeafTextInput
                        label={strings("inputLabel.givenName")}
                        textColor={givenNameIsValid() || !givenName ? LeafColors.textDark : LeafColors.textError}
                        color={LeafColors.textBackgroundDark}
                        onTextChange={(text) => {
                            setGivenName(text);
                        }}
                        initialValue={givenName}
                    />

                    <LeafTextInput
                        label={strings("inputLabel.surname")}
                        textColor={surnameNameIsValid() || !surname ? LeafColors.textDark : LeafColors.textError}
                        color={LeafColors.textBackgroundDark}
                        onTextChange={(text) => {
                            setSurname(text);
                        }}
                        initialValue={surname}
                    />

                    <LeafTextInput
                        label={strings("inputLabel.mrn")}
                        textColor={mrnIsValid() || !mrn ? LeafColors.textDark : LeafColors.textError}
                        color={LeafColors.textBackgroundDark}
                        onTextChange={(text) => {
                            setMRN(text);
                        }}
                        initialValue={mrn}
                        locked={editPatientMode}
                    />

                    <LeafTextInput
                        label={strings("inputLabel.postcode")}
                        textColor={postcodeIsValid() || !postcode ? LeafColors.textDark : LeafColors.textError}
                        color={LeafColors.textBackgroundDark}
                        onTextChange={(text) => {
                            setPostcode(text);
                        }}
                        initialValue={postcode}
                    />

                    <LeafDateInput
                        label={strings("inputLabel.dob")}
                        textColor={dobIsValid() || !dob ? LeafColors.textDark : LeafColors.textError}
                        onChange={(date) => {
                            setDOB(date);
                        }}
                        initialValue={dob}
                    />

                    <LeafTextInput
                        label={strings("inputLabel.phone")}
                        textColor={phoneIsValid() || !phone ? LeafColors.textDark : LeafColors.textError}
                        color={LeafColors.textBackgroundDark}
                        onTextChange={(text) => {
                            setPhone(text);
                        }}
                        initialValue={phone}
                    />

                    <LeafSegmentedButtons
                        label={strings("inputLabel.sex")}
                        options={[
                            new LeafSegmentedValue(PatientSex.male, PatientSex.male.toString()),
                            new LeafSegmentedValue(PatientSex.female, PatientSex.female.toString()),
                            new LeafSegmentedValue(PatientSex.other, PatientSex.other.toString()),
                        ]}
                        value={sex}
                        onSetValue={(segmentedValue) => {
                            setSex(segmentedValue);
                        }}
                    />
                </VStack>

                <FormHeader title={strings("triageForm.title.triage")} style={{ paddingVertical: formPadding }} />

                <VStack spacing={LeafDimensions.textInputSpacing} style={{ width: "100%" }}>
                    <TriageCodePicker
                        onSelection={(code) => {
                            setTriageCode(code);
                        }}
                        initialValue={triageCode}
                        style={{ paddingBottom: 8 }}
                    />

                    <LeafMultilineTextInput
                        label={strings("inputLabel.triageDescription")}
                        onTextChange={(text) => {
                            setTriageDescription(text);
                        }}
                        textColor={
                            triageDescriptionIsValid() || !triageDescription
                                ? LeafColors.textDark
                                : LeafColors.textError
                        }
                        initialValue={triageDescription}
                    />
                </VStack>

                <FormHeader
                    title={strings("triageForm.title.hospitalisation")}
                    style={{ paddingVertical: formPadding }}
                />

                <VStack spacing={LeafDimensions.textInputSpacing} style={{ width: "100%" }}>
                    <LeafSelectionInput
                        navigation={navigation}
                        items={HospitalArray.map((hospital) => {
                            return new LeafSelectionItem(hospital.name, hospital.code, hospital);
                        })}
                        title={strings("inputLabel.hospital")}
                        selected={selectedHospital}
                        onSelection={(item: LeafSelectionItem<unknown> | undefined) => {
                            setSelectedHospital(item as LeafSelectionItem<Hospital> | undefined);
                            // Reset medical unit and ward in case they don't match (belong to) the newly selected hospital
                            setSelectedMedicalUnit(undefined);
                            setSelectedWard(undefined);
                        }}
                    />

                    <LeafSelectionInput
                        navigation={navigation}
                        items={
                            selectedHospital == undefined
                                ? []
                                : selectedHospital.value.wardsAsArray.map((ward) => {
                                      return new LeafSelectionItem(ward.name, ward.hospitalCode, ward);
                                  })
                        }
                        title={strings("inputLabel.ward")}
                        selected={selectedWard}
                        disabled={selectedHospital == undefined}
                        onSelection={(item: LeafSelectionItem<unknown> | undefined) => {
                            setSelectedWard(item as LeafSelectionItem<Ward> | undefined);
                        }}
                    />

                    <LeafSelectionInput
                        navigation={navigation}
                        items={
                            selectedHospital == undefined
                                ? []
                                : selectedHospital.value.medUnitsAsArray.map((medUnit) => {
                                      return new LeafSelectionItem(medUnit.name, medUnit.group, medUnit);
                                  })
                        }
                        title={strings("inputLabel.medicalUnit")}
                        selected={selectedMedicalUnit}
                        disabled={selectedHospital == undefined}
                        onSelection={(item: LeafSelectionItem<unknown> | undefined) => {
                            setSelectedMedicalUnit(item as LeafSelectionItem<MedicalUnit> | undefined);
                        }}
                    />
                </VStack>

                <FormHeader title={strings("triageForm.title.end")} style={{ paddingVertical: formPadding }} />

                <HStack spacing={24}>
                    {editPatientMode ? null : (
                        <LeafButton
                            label={strings("button.clear")}
                            wide={false}
                            onPress={() => {
                                StateManager.clearAllInputs.publish();
                            }}
                            style={{ flex: 1 }}
                            color={LeafColors.fillBackgroundLight}
                            typography={LeafTypography.button.withColor(LeafColors.textSemiDark)}
                        />
                    )}

                    <LeafButton label={strings("button.submit")} wide={false} onPress={onSubmit} style={{ flex: 1 }} />
                </HStack>
            </VStack>
        </KeyboardAwareScreenContainer>
    );
};

export default NewTriageScreen;
