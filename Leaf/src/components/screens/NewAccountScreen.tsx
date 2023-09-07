import { NavigationProp, ParamListBase } from "@react-navigation/native";
import React, { useState } from "react";
import { strings } from "../../localisation/Strings";
import Admin from "../../model/employee/Admin";
import Employee from "../../model/employee/Employee";
import Leader from "../../model/employee/Leader";
import { Role } from "../../model/employee/Role";
import Worker from "../../model/employee/Worker";
import Hospital from "../../model/hospital/Hospital";
import Session from "../../model/session/Session";
import { HospitalsArray } from "../../preset_data/Hospitals";
import ValidateUtil from "../../utils/ValidateUtil";
import LeafButton from "../base/LeafButton/LeafButton";
import { LeafButtonType } from "../base/LeafButton/LeafButtonType";
import LeafSelectionInput from "../base/LeafListSelection/LeafSelectionInput";
import LeafSelectionItem from "../base/LeafListSelection/LeafSelectionItem";
import LeafTextInput from "../base/LeafTextInput/LeafTextInput";
import VStack from "../containers/VStack";
import VGap from "../containers/layout/VGap";
import CreateAccountCard from "../custom/CreateAccountCard";
import RolePicker from "../custom/RolePicker";
import LeafColors from "../styling/LeafColors";
import LeafTypography from "../styling/LeafTypography";
import DefaultScreenContainer from "./containers/DefaultScreenContainer";
import EmployeeID from "../../model/employee/EmployeeID";

interface Props {
    navigation?: NavigationProp<ParamListBase>;
}

const NewAccountScreen: React.FC<Props> = ({ navigation }) => {
    const [createdAccount, setCreatedAccount] = React.useState<Employee | null>(null);
    const [name, setName] = React.useState("");
    const [surname, setSurname] = React.useState("");
    const [role, setRole] = React.useState<Role | undefined>(undefined);
    const [selectedHosptial, setSelectedHospital] = useState<LeafSelectionItem<Hospital> | undefined>(undefined);

    const onNameChange = (name: string) => {
        setName(name);
    };

    const onSurnameChange = (name: string) => {
        setSurname(name);
    };

    const onRoleChange = (role: Role | undefined) => {
        setRole(role);
    };

    const onSubmit = async () => {
        if (
            !(
                ValidateUtil.stringIsValid(name) &&
                ValidateUtil.stringIsValid(surname) &&
                ValidateUtil.valueIsDefined(role) &&
                (role!.matches(Role.admin) || ValidateUtil.valueIsDefined(selectedHosptial))
            )
        ) {
            setCreatedAccount(null);
            // TODO: Provide user feedback
            return;
        }

        let employee: Employee | null = null;
        if (role!.matches(Role.admin)) {
            const newAdmin = Admin.new(await EmployeeID.generate(), name, surname);
            const success = await Session.inst.submitNewAdmin(newAdmin);
            if (success) {
                employee = newAdmin;
            }
        } else if (role!.matches(Role.worker)) {
            const newWorker = Worker.new(await EmployeeID.generate(), name, surname, selectedHosptial!.value);
            const success = await Session.inst.submitNewWorker(newWorker);
            if (success) {
                employee = newWorker;
            }
        } else if (role!.matches(Role.leader)) {
            const newLeader = Leader.new(await EmployeeID.generate(), name, surname, selectedHosptial!.value);
            const success = await Session.inst.submitNewLeader(newLeader);
            if (success) {
                employee = newLeader;
            }
        }
        setCreatedAccount(employee);
    };

    return (
        <DefaultScreenContainer>
            <VStack spacing={16}>
                <RolePicker onSelection={onRoleChange} />

                <LeafTextInput
                    label={strings("inputLabel.givenName")}
                    textColor={LeafColors.textDark}
                    color={LeafColors.textBackgroundDark}
                    onTextChange={onNameChange}
                />

                <LeafTextInput
                    label={strings("inputLabel.surname")}
                    textColor={LeafColors.textDark}
                    color={LeafColors.textBackgroundDark}
                    onTextChange={onSurnameChange}
                />

                {role?.matches(Role.admin) ?? true ? undefined : (
                    <LeafSelectionInput
                        navigation={navigation}
                        items={HospitalsArray.map((hospital) => {
                            return new LeafSelectionItem(hospital.name, hospital.code, hospital);
                        })}
                        title={strings("inputLabel.hopsital")}
                        selected={selectedHosptial}
                        onSelection={(item: LeafSelectionItem<unknown> | undefined) => {
                            setSelectedHospital(item as LeafSelectionItem<Hospital> | undefined);
                        }}
                    />
                )}

                <VGap size={12} />

                <LeafButton
                    label={strings("button.createAccount")}
                    icon="account-plus"
                    typography={LeafTypography.button}
                    type={LeafButtonType.Filled}
                    color={LeafColors.accent}
                    onPress={onSubmit}
                />

                <VGap size={12} />

                {createdAccount == null ? undefined : <CreateAccountCard employee={createdAccount} />}
            </VStack>
        </DefaultScreenContainer>
    );
};

export default NewAccountScreen;
