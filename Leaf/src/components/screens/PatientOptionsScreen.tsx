import React from "react";
import LeafText from "../base/LeafText/LeafText";
import LeafTypography from "../styling/LeafTypography";
import { View } from "react-native";
import LeafColors from "../styling/LeafColors";
import VStack from "../containers/VStack";
import LeafDimensions from "../styling/LeafDimensions";
import { ScrollView } from "react-native-gesture-handler";
import LeafButton from "../base/LeafButton/LeafButton";
import NavigationSession from "../navigation/state/NavigationEnvironment";
import { LeafButtonType } from "../base/LeafButton/LeafButtonType";
import ActionsScreen from "./ActionsScreen";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import PatientPreviewScreen from "./PatientPreviewScreen";
import NewTriageScreen from "./NewTriageScreen";

interface Props {
    navigation?: NavigationProp<ParamListBase>;
}

const PatientOptionsScreen: React.FC<Props> = ({ navigation }) => {
    return (
        <View
            style={{
                backgroundColor: LeafColors.screenBackgroundLight.getColor(),
                flex: 1,
            }}
        >
            <ScrollView
                style={{
                    flex: 1,
                    paddingTop: LeafDimensions.screenTopPadding,
                    paddingHorizontal: LeafDimensions.screenPadding,
                }}
            >
                <VStack
                    spacing={LeafDimensions.screenSpacing}
                    style={{
                        flex: 1,
                    }}
                >
                    <LeafText typography={LeafTypography.body}>TODO: Patient Options</LeafText>

                    <LeafButton
                        label={"Actions"}
                        icon="arrow-right-circle"
                        typography={LeafTypography.button}
                        type={LeafButtonType.Filled}
                        color={LeafColors.accent}
                        onPress={() => {
                            NavigationSession.inst.navigateTo(ActionsScreen, navigation, "Actions");
                        }}
                    />

                    <LeafButton
                        label={"Patient Preview"}
                        icon="arrow-right-circle"
                        typography={LeafTypography.button}
                        type={LeafButtonType.Filled}
                        color={LeafColors.accent}
                        onPress={() => {
                            NavigationSession.inst.navigateTo(PatientPreviewScreen, navigation, "Patient Preview");
                        }}
                    />

                    <LeafButton
                        label={"Edit"}
                        icon="arrow-right-circle"
                        typography={LeafTypography.button}
                        type={LeafButtonType.Filled}
                        color={LeafColors.accent}
                        onPress={() => {
                            NavigationSession.inst.navigateTo(NewTriageScreen, navigation, "Edit");
                        }}
                    />

                    <LeafButton
                        label={"Done"}
                        icon="arrow-right-circle"
                        typography={LeafTypography.button}
                        type={LeafButtonType.Filled}
                        color={LeafColors.accent}
                        onPress={() => {
                            // Add a method to NavigationStateManager
                            // If navigation == undefined
                            // then clear the screens
                            NavigationSession.inst.navigateBack(navigation);
                        }}
                    />
                </VStack>
            </ScrollView>
        </View>
    );
};

export default PatientOptionsScreen;
