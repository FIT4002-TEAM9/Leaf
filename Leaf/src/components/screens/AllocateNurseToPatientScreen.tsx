import VStack from "../containers/VStack";
import DefaultScreenContainer from "./containers/DefaultScreenContainer";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import VGap from "../containers/layout/VGap";
import React, { useEffect, useState } from "react";
import Patient from "../../model/patient/Patient";
import StateManager from "../../state/publishers/StateManager";
import { FlatList } from "react-native";
import PatientAllocationCard from "../custom/PatientAllocationCard";
import LeafDimensions from "../styling/LeafDimensions";
import LeafSearchBarNew from "../base/LeafSearchBar/LeafSearchBarNew";
import { strings } from "../../localisation/Strings";
import LeafButton from "../base/LeafButton/LeafButton";
import HStack from "../containers/HStack";
import HGap from "../containers/layout/HGap";
import LeafTypography from "../styling/LeafTypography";
import LeafColors from "../styling/LeafColors";
import LeafText from "../base/LeafText/LeafText";
import Session from "../../model/session/Session";

interface Props {
    navigation?: NavigationProp<ParamListBase>;
}

const AllocateNurseToPatientScreen: React.FC<Props> = ({ navigation }) => {
    const [nurse, setNurse] = useState(Session.inst.getActiveWorker());
    const [patients, setPatients] = React.useState<Patient[]>(Session.inst.getAllPatients());
    const [filteredPatients, setFilteredPatients] = React.useState<Patient[]>(patients);
    const [searchQuery, setSearchQuery] = React.useState("");
    const onSearch = (query: string) => {
        setSearchQuery(query);
    };

    useEffect(() => {
        StateManager.patientsFetched.subscribe(() => {
            setPatients(Session.inst.getAllPatients());
        });
        setFilteredPatients(Session.inst.getAllPatients());
        Session.inst.fetchAllPatients();

        StateManager.activeWorkerChanged.subscribe(() => {
            setNurse(Session.inst.getActiveWorker());
        });
        
    }, []);

    return (
        <DefaultScreenContainer>
            <VStack
                style={{
                    flex: 1,
                }}
                spacing={20}
            >
                <LeafText typography={LeafTypography.subscript}>
                    {strings("label.patientAllocateToNurse")}{"\n"}
                    <LeafText typography={LeafTypography.title4}>
                        {nurse?.fullName || "..." + strings("label.loading")}
                    </LeafText>
                </LeafText>

                <LeafSearchBarNew
                    onTextChange={onSearch}
                    data={patients}
                    setData={setFilteredPatients}
                    dataToString={(patient: Patient) => patient.fullName}
                />

                <HStack>
                    {/* 
                        // TODO: replace with dropdowns after merge
                    */}
                    <LeafButton
                        label={strings("searchBarFilter.time")}
                        onPress={() => null}
                        typography={LeafTypography.title4}
                        color={LeafColors.fillBackgroundLight}
                        wide={false}
                    ></LeafButton>

                    <HGap size={6} />

                    <LeafButton
                        label={strings("searchBarFilter.triageCode")}
                        onPress={() => null}
                        typography={LeafTypography.title4}
                        color={LeafColors.fillBackgroundLight}
                        wide={false}
                    ></LeafButton>
                </HStack>

                <FlatList
                    data={filteredPatients}
                    renderItem={({ item: patient, index: index }) => <PatientAllocationCard patient={patient} />}
                    keyExtractor={(patient) => patient.mrn.toString()}
                    ItemSeparatorComponent={() => <VGap size={LeafDimensions.cardSpacing} />}
                    scrollEnabled={false}
                    // Don't use overflow prop - doesn't work on web
                    style={{
                        width: "100%",
                        overflow: "visible", // Stop shadows getting clipped
                        flexGrow: 0, // Ensures the frame wraps only the FlatList content
                    }}
                />
            </VStack>
        </DefaultScreenContainer>
    );
};

export default AllocateNurseToPatientScreen;