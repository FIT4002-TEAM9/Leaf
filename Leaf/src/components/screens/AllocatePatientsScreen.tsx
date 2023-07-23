import React, { useEffect } from "react";
import { FlatList, ScrollView } from "react-native";
import Session from "../../model/Session";
import Patient from "../../model/patient/Patient";
import StateManager from "../../state/publishers/StateManager";
import LeafText from "../base/LeafText/LeafText";
import VStack from "../containers/VStack";
import Spacer from "../containers/layout/Spacer";
import VGap from "../containers/layout/VGap";
import PatientCard from "../custom/PatientCard";
import LeafColors from "../styling/LeafColors";
import LeafDimensions from "../styling/LeafDimensions";
import LeafTypography from "../styling/LeafTypography";
import AllocateCard from "../custom/AllocateCard";

const AllocatePatientsScreen: React.FC = () => {
    const [patients, setPatients] = React.useState<Patient[]>(Session.inst.getAllPatients());

    useEffect(() => {
        StateManager.patientsFetched.subscribe(() => {
            setPatients(Session.inst.getAllPatients());
        });

        Session.inst.fetchAllPatients();
    }, []);

    const onPressPatient = (patient) => {
        // TODO: Navigation
        console.log(patient.fullName);
    };

    const onPressNewAllocation = () => {
        // TODO: Patient Allocation Page
        console.log("new Allocation");
    };

    return (
        <ScrollView
            style={{
                flex: 1,
                padding: LeafDimensions.screenPadding,
                backgroundColor: LeafColors.screenBackgroundLight.getColor(),
            }}
        >
            <VStack
                spacing={LeafDimensions.screenSpacing}
                style={{
                    flex: 1,
                }}
            >
                <LeafText typography={LeafTypography.header}>TODO</LeafText>

                <AllocateCard
                    onPress={() => {
                        onPressNewAllocation;
                    }}
                />

                <FlatList
                    data={patients}
                    renderItem={({ item: patient }) => (
                        <PatientCard
                            patient={patient}
                            onPress={() => {
                                onPressPatient(patient);
                            }}
                        />
                    )}
                    keyExtractor={(patient) => patient.mrn.toString()}
                    ItemSeparatorComponent={() => <VGap size={LeafDimensions.cardSpacing} />}
                    scrollEnabled={false}
                    // Don't use overflow prop - doesn't work on web
                    style={{
                        overflow: "visible", // Stop shadows getting clipped
                        flexGrow: 0, // Ensures the frame wraps only the FlatList content
                    }}
                />

                <Spacer />
            </VStack>
        </ScrollView>
    );
};

export default AllocatePatientsScreen;