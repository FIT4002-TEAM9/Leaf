import { NavigationProp, ParamListBase } from "@react-navigation/native";
import React, { useEffect } from "react";
import { FlatList, ScrollView } from "react-native";
import Worker from "../../model/employee/Worker";
import Session from "../../model/session/Session";
import StateManager from "../../state/publishers/StateManager";
import VStack from "../containers/VStack";
import Spacer from "../containers/layout/Spacer";
import VGap from "../containers/layout/VGap";
import WorkerCard from "../custom/WorkerCard";
import NavigationSession from "../navigation/state/NavigationEnvironment";
import LeafDimensions from "../styling/LeafDimensions";
import ManageNurseScreen from "./ManageWorkerScreen";
import DefaultScreenContainer from "./containers/DefaultScreenContainer";
import LeafSearchBar from "../base/LeafSearchBar/LeafSearchBar";
import Environment from "../../state/environment/Environment";
import { OS } from "../../state/environment/types/OS";
import { ScreenType } from "../../state/environment/types/ScreenType";

interface Props {
    navigation?: NavigationProp<ParamListBase>;
}

const AllNursesScreen: React.FC<Props> = ({ navigation }) => {
    const [workers, setWorkers] = React.useState<Worker[]>(Session.inst.getAllWorkers());
    const [filteredWorkers, setFilteredWorkers] = React.useState<Worker[]>(workers);
    const [searchQuery, setSearchQuery] = React.useState("");
    const onSearch = (query: string) => {
        setSearchQuery(query);
    };

    useEffect(() => {
        const unsubscribe = StateManager.workersFetched.subscribe(() => {
            setWorkers(Session.inst.getAllWorkers());
            setFilteredWorkers(Session.inst.getAllWorkers());
        });

        Session.inst.fetchAllPatients();
        Session.inst.fetchAllWorkers();

        return () => {
            unsubscribe();
        };
    }, []);

    const onPressWorker = (worker: Worker) => {
        Session.inst.setActiveWorker(worker);
        NavigationSession.inst.navigateTo(ManageNurseScreen, navigation, worker.fullName);
    };

    return (
        <DefaultScreenContainer>
            <VStack
                spacing={LeafDimensions.screenSpacing}
                style={{
                    flex: 1,
                }}
            >
                <ScrollView style={{ flex: 1, width: "100%" }}>
                    <LeafSearchBar
                        onTextChange={onSearch}
                        data={workers}
                        setData={setFilteredWorkers}
                        dataToString={(worker: Worker) => worker.fullName}
                    />

                    <VGap size={LeafDimensions.cardTopPadding} />

                    <FlatList
                        data={filteredWorkers}
                        renderItem={({ item: worker }) => (
                            <WorkerCard
                                worker={worker}
                                onPress={() => {
                                    onPressWorker(worker);
                                }}
                            />
                        )}
                        keyExtractor={(worker) => worker.id.toString()}
                        ItemSeparatorComponent={() => <VGap size={LeafDimensions.cardSpacing} />}
                        scrollEnabled={false}
                        style={{
                            width: "100%",
                            overflow: "visible", // Stop shadows getting clipped
                            flexGrow: 0, // Ensures the frame wraps only the FlatList content
                            ...(Environment.inst.getOS() == OS.Web &&
                            Environment.inst.getScreenType() != ScreenType.Mobile
                                ? { height: Environment.inst.getScreenHeight() - 145 }
                                : {}),
                        }}
                    />

                    <Spacer />
                </ScrollView>
            </VStack>
        </DefaultScreenContainer>
    );
};

export default AllNursesScreen;
