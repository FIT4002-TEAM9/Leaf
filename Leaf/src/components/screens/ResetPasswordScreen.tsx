import { NavigationProp, ParamListBase } from "@react-navigation/native";
import React, { useState } from "react";
import { View } from "react-native";
import { strings } from "../../localisation/Strings";
import LeafButton from "../base/LeafButton/LeafButton";
import { LeafButtonType } from "../base/LeafButton/LeafButtonType";
import LeafText from "../base/LeafText/LeafText";
import LeafTextInput from "../base/LeafTextInput/LeafTextInput";
import VStack from "../containers/VStack";
import Spacer from "../containers/layout/Spacer";
import VGap from "../containers/layout/VGap";
import NavigationSession from "../navigation/state/NavigationEnvironment";
import LeafColors from "../styling/LeafColors";
import LeafDimensions from "../styling/LeafDimensions";
import LeafTypography from "../styling/LeafTypography";
import DefaultScreenContainer from "./containers/DefaultScreenContainer";
import KeyboardAwareScreenContainer from "./containers/KeyboardAwareScreenContainer";
import ValidateUtil from "../../utils/ValidateUtil";
import Session from "../../model/session/Session";
import EmployeeID from "../../model/employee/EmployeeID";
import PasswordUtil from "../../utils/PasswordUtil";
import LeafPasswordInputShort from "../base/LeafPasswordInputShort/LeafPasswordInputShort";

interface Props {
    navigation?: NavigationProp<ParamListBase>;
}

const ResetPasswordScreen: React.FC<Props> = ({ navigation }) => {
    const [username, setUsername] = useState<string | undefined>(undefined);
    const [newPassword, setNewPassword] = useState<string | undefined>(undefined);
    const [confirmationNewPassword, setConfirmationNewPassword] = useState<string | undefined>(undefined);

    const allIsValid: () => boolean = () => {
        return (
            ValidateUtil.stringIsValid(username) &&
            ValidateUtil.stringIsValid(newPassword) &&
            ValidateUtil.stringIsValid(confirmationNewPassword) &&
            newPassword == confirmationNewPassword
        );
    };

    const onResetPressed = async () => {
        if (!allIsValid()) {
            // TODO: Provide feedback
            console.log("Invalid inputs");
            return;
        }
        const id = new EmployeeID(username!);

        // Check if the account exists
        const account = await Session.inst.fetchAccount(id);
        if (account == null) {
            // TODO: Provide feedback (no account found)
            console.log("Account not found.");
            return;
        }

        // Update password on account
        if (newPassword != undefined) {
            account.setPassword(newPassword);
            Session.inst.updateAccount(account);
        }

        //TODO: Provide Feedback

        // Navigate back
        NavigationSession.inst.navigateBack(navigation);
    };

    return (
        <KeyboardAwareScreenContainer centerContent={true}>
            <VStack
                spacing={LeafDimensions.screenSpacing}
                style={{
                    flex: 1,
                    alignItems: "center",
                    width: "100%",
                    backgroundColor: LeafColors.screenBackgroundLight.getColor(),
                    flexWrap: "nowrap",
                }}
            >
                <LeafText typography={LeafTypography.headerScreen} style={{ textAlign: "center", paddingBottom: 20 }}>
                    {strings("login.resetPassword")}
                </LeafText>

                <View
                    style={{
                        maxWidth: 400,
                        width: "100%",
                    }}
                >
                    <LeafTextInput
                        label={strings("inputLabel.username")}
                        textColor={
                            ValidateUtil.stringIsValid(username) || !username
                                ? LeafColors.textDark
                                : LeafColors.textError
                        }
                        color={LeafColors.textBackgroundDark}
                        onTextChange={(text) => {
                            setUsername(text);
                        }}
                    />

                    <VGap size={LeafDimensions.textInputSpacing} />

                    <LeafPasswordInputShort
                        label={strings("inputLabel.newPassword")}
                        textColor={
                            ValidateUtil.stringIsValid(newPassword) || !newPassword
                                ? LeafColors.textDark
                                : LeafColors.textError
                        }
                        color={LeafColors.textBackgroundDark}
                        onTextChange={(text) => {
                            setNewPassword(text);
                        }}
                    />

                    <VGap size={LeafDimensions.textInputSpacing} />

                    <LeafPasswordInputShort
                        label={strings("inputLabel.confirmNewPassword")}
                        textColor={
                            ValidateUtil.stringIsValid(confirmationNewPassword) &&
                            confirmationNewPassword == newPassword
                                ? LeafColors.textDark
                                : LeafColors.textError
                        }
                        color={LeafColors.textBackgroundDark}
                        onTextChange={(text) => {
                            setConfirmationNewPassword(text);
                        }}
                    />

                    <LeafButton
                        label={strings("button.reset")}
                        icon="badge-account-horizontal"
                        typography={LeafTypography.button}
                        type={LeafButtonType.Filled}
                        color={LeafColors.accent}
                        style={{ marginTop: 36 }}
                        onPress={onResetPressed}
                    />

                    <LeafButton
                        label={strings("button.cancel")}
                        typography={LeafTypography.button.withColor(LeafColors.textSemiDark)}
                        type={LeafButtonType.Filled}
                        color={LeafColors.fillBackgroundLight}
                        style={{ marginTop: 12 }}
                        onPress={() => {
                            NavigationSession.inst.navigateBack(navigation);
                        }}
                    />
                </View>
            </VStack>
        </KeyboardAwareScreenContainer>
    );
};

export default ResetPasswordScreen;
