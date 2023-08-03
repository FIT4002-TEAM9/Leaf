import React, { useEffect } from "react";
import LeafTypography from "../styling/LeafTypography";
import LeafButton from "../base/LeafButton/LeafButton";
import { LeafButtonType } from "../base/LeafButton/LeafButtonType";
import LeafColors from "../styling/LeafColors";
import { strings } from "../../localisation/Strings";
import VGap from "../containers/layout/VGap";
import EmployeeID from "../../model/employee/EmployeeID";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import VStack from "../containers/VStack";
import HStack from "../containers/HStack";
import LeafIcon from "../base/LeafIcon/LeafIcon";
import { LeafIconSize } from "../base/LeafIcon/LeafIconSize";
import LeafText from "../base/LeafText/LeafText";
import LeafTextInput from "../base/LeafTextInput/LeafTextInput";
import DefaultScreenContainer from "./containers/DefaultScreenContainer";
import RolePicker from "../custom/RolePicker";
import CreateAccountCard from "../custom/CreateAccountCard";
import Worker from "../../model/employee/Worker";

interface Props {
    navigation?: NavigationProp<ParamListBase>;
}

const NewAccountScreen: React.FC<Props> = ({ navigation }) => {
    const [hasCreate, setHasCreate] = React.useState(false);
    return (
        <DefaultScreenContainer>
            <VStack>
                <HStack spacing={6} style={{ width: "100%", alignItems: "center", paddingBottom: 14 }}>
                    <LeafIcon icon={"clipboard-account"} color={LeafColors.textDark} size={LeafIconSize.Small} />

                    <LeafText typography={LeafTypography.title4} wide={false}>
                        {strings("label.selectRole")}
                    </LeafText>
                </HStack>

                <RolePicker onSelection={(code) => {}} />

                <VGap size={32} />

                <HStack spacing={6} style={{ width: "100%", alignItems: "center", paddingBottom: 14 }}>
                    <LeafIcon icon={"rename-box"} color={LeafColors.textDark} size={LeafIconSize.Small} />

                    <LeafText typography={LeafTypography.title4} wide={false}>
                        {strings("label.enterName")}
                    </LeafText>
                </HStack>

                <VStack spacing={8} style={{ width: "100%" }}>
                    <LeafTextInput
                        label={strings("triageForm.textInput.givenName")}
                        textColor={LeafColors.textDark}
                        color={LeafColors.textBackgroundDark}
                        onTextChange={() => {}}
                    />

                    <LeafTextInput
                        label={strings("triageForm.textInput.surname")}
                        textColor={LeafColors.textDark}
                        color={LeafColors.textBackgroundDark}
                        onTextChange={() => {}}
                    />
                </VStack>

                <VGap size={32} />

                <LeafButton
                    label={strings("button.createAccount")}
                    icon="account-plus"
                    typography={LeafTypography.button}
                    type={LeafButtonType.Filled}
                    color={LeafColors.accent}
                    onPress={() => {
                        setHasCreate(true);
                        // TODO: should change to create account method later.
                    }}
                />

                <VGap size={32} />

                <CreateAccountCard
                    worker={new Worker(EmployeeID.generate(), "Jason", "ANY")}
                    onPress={null}
                    display={hasCreate}
                />
            </VStack>
        </DefaultScreenContainer>
    );
};

export default NewAccountScreen;