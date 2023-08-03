import React from "react";
import LeafText from "../base/LeafText/LeafText";
import LeafTypography from "../styling/LeafTypography";
import LeafDimensions from "../styling/LeafDimensions";
import LeafButton from "../base/LeafButton/LeafButton";
import { LeafButtonType } from "../base/LeafButton/LeafButtonType";
import LeafColors from "../styling/LeafColors";
import StateManager from "../../state/publishers/StateManager";
import { LoginStatus } from "../../state/publishers/types/LoginStatus";
import { strings } from "../../localisation/Strings";
import { View, ViewStyle } from "react-native";
import FlatContainer from "../containers/FlatContainer";
import VStack from "../containers/VStack";
import VGap from "../containers/layout/VGap";
import DefaultScreenContainer from "./containers/DefaultScreenContainer";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import Session from "../../model/Session";

interface Props {
    navigation?: NavigationProp<ParamListBase>;
}

const ManageWorkerScreen: React.FC<Props> = ({ navigation }) => {
    const worker = Session.inst.getActiveWorker();
    return (
        <DefaultScreenContainer>
            <VStack
                spacing={LeafDimensions.screenSpacing}
                style={{
                    flex: 1,
                }}
            >
                <LeafText typography={LeafTypography.body}>{worker.role}</LeafText>

                <LeafText typography={LeafTypography.body}>{strings("label.details")}</LeafText>

                <FlatContainer color={LeafColors.fillBackgroundLight}>
                    <VStack>
                        <View style={{ alignSelf: "flex-start" }}>
                            <LeafText typography={LeafTypography.title3} verticalWrap={true}>
                                {strings("label.id") + worker.id.toString()}
                            </LeafText>
                        </View>

                        <VGap size={6} />
                    </VStack>
                </FlatContainer>

                <VGap size={32} />

                <LeafButton
                    label={strings("button.deleteAccount")}
                    icon="delete"
                    typography={LeafTypography.button}
                    type={LeafButtonType.Filled}
                    color={LeafColors.textError}
                    onPress={() => {
                        StateManager.loginStatus.publish(LoginStatus.LoggedOut); // should change to delete account method later.
                    }}
                />

                <LeafText typography={LeafTypography.subscript} wide={false}>
                    {strings("operation.removeAccount")}
                </LeafText>
            </VStack>
        </DefaultScreenContainer>
    );
};

export default ManageWorkerScreen;