import { ScrollView, Spacer, VStack } from "native-base";
import React, { useEffect } from "react";
import LeafText from "../core/views/LeafText/LeafText";
import LeafTypography from "../core/styles/LeafTypography";
import LeafDimensions from "../core/styles/LeafDimensions";
import StateManager from "../../state/publishers/StateManager";
import Session from "../../model/Session";
import Patient from "../../model/patient/Patient";
import { FlatList } from "native-base";
import PatientCard from "../worker/components/PatientCard";
import { strings } from "../../localisation/Strings";
import AllocateCard from "./AllocateCard";
import LeafBaseDimensions from "../core/styles/LeafBaseDimensions";

const AllocatePatientsScreen: React.FC = () => {
    const [patients, setPatients] = React.useState<Patient[]>(Session.instance.getAllPatients());

    //count how many patients the nurse is currently allocated to
    let countPatients = Session.instance.getAllPatients().length;

    StateManager.patientsFetched.subscribe(() => {
        setPatients(Session.instance.getAllPatients());
    });

    useEffect(() => {
        Session.instance.fetchAllPatients();
    }, []);

    const onPressPatient = (patient) => {
        // TODO: Navigation
        console.log(patient.fullName);
    }

    const onPressNewAllocation = () => {
        // TODO: Patient Allocation Page
        console.log("new Allocation");
    }

    return (
        <ScrollView 
            flex={1}
            padding={LeafBaseDimensions.screenPadding}
        >
            <VStack 
                flex={1}
                space={LeafBaseDimensions.screenSpacing}
            >
                <LeafText typography={LeafTypography.header}>
                    Nabeeb
                </LeafText>

                <AllocateCard
                    onPress={() => {onPressNewAllocation}}
                />
                    

                <FlatList
                    data={patients}
                    renderItem={({ item: patient }) => (
                        <PatientCard 
                            patient={patient} 
                            onPress={() => {onPressPatient(patient)}}
                        />
                    )}
                    keyExtractor={(patient) => patient.mrn.toString()}
                    ItemSeparatorComponent={() => (
                        <Spacer size={LeafBaseDimensions.cardSpacing} />
                    )}
                    scrollEnabled={false}
                    // flexGrow ensures the frame wraps only the FlatList content
                    flexGrow={0}
                    // Stop shadows getting clipped
                    // Don't use overflow prop - doesn't work on web
                    style={{ overflow: 'visible' }}
                />

                <Spacer />
            </VStack>
        </ScrollView>
    );
}

export default AllocatePatientsScreen;