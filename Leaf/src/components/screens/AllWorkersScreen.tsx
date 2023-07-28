import React, { useEffect } from "react";
import { FlatList, ScrollView } from "react-native";
import Session from "../../model/Session";
import Worker from "../../model/employee/Worker";
import StateManager from "../../state/publishers/StateManager";
import VStack from "../containers/VStack";
import Spacer from "../containers/layout/Spacer";
import VGap from "../containers/layout/VGap";
import LeafColors from "../styling/LeafColors";
import LeafDimensions from "../styling/LeafDimensions";
import WorkerCard from "../custom/WorkerCard";
import DefaultScreenContainer from "./containers/DefaultScreenContainer";
import NavigationSession from "../navigation/state/NavigationEnvironment";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import NurseAllocationScreen from "./NurseAllocationScreen";
import LeafText from "../base/LeafText/LeafText";
import LeafTypography from "../styling/LeafTypography";
import LeafSearchBar from "../base/LeafSearchBar/LeafSearchBar";
import { strings } from "../../localisation/Strings";

interface Props {
    navigation?: NavigationProp<ParamListBase>;
}

const AllWorkersScreen: React.FC<Props> = ({ navigation }) => {
    const [workers, setWorkers] = React.useState<Worker[]>(Session.inst.getAllWorkers());

    useEffect(() => {
        StateManager.workersFetched.subscribe(() => {
            setWorkers(Session.inst.getAllWorkers());
        });

        Session.inst.fetchAllWorkers();
    }, []);

    const onPressWorker = (worker) => {
        Session.inst.setActiveWorker(worker);
        NavigationSession.inst.navigateTo(NurseAllocationScreen, navigation, worker.fullName);
    };

    const [searchQuery, setSearchQuery] = React.useState("");
    const onSearch = (query: string) => {
        setSearchQuery(query);
        // TODO: Search for worker using query
    };

    return (
        <DefaultScreenContainer>
            <VStack
                spacing={LeafDimensions.screenSpacing}
                style={{
                    flex: 1,
                    width: "100%",
                }}
            >
                <LeafSearchBar searchQuery={searchQuery} onSearch={onSearch}></LeafSearchBar>

                <VGap size={10} />

                <FlatList
                    data={workers}
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
                    // Don't use overflow prop - doesn't work on web
                    style={{
                        overflow: "visible", // Stop shadows getting clipped
                        flexGrow: 0, // Ensures the frame wraps only the FlatList content
                    }}
                />

                <Spacer />
            </VStack>
        </DefaultScreenContainer>
    );
};

export default AllWorkersScreen;
