import { View, ViewStyle } from "react-native";
import LeafColors from "../styling/LeafColors";
import LeafTypography from "../styling/LeafTypography";
import LeafText from "../base/LeafText/LeafText";
import FloatingContainer from "../containers/FloatingContainer";
import Worker from "../../model/employee/Worker";
import VGap from "../containers/layout/VGap";
import VStack from "../containers/VStack";
import HStack from "../containers/HStack";
import LeafButton from "../base/LeafButton/LeafButton";
import { LeafButtonType } from "../base/LeafButton/LeafButtonType";
import { strings } from "../../localisation/Strings";
import LeafDimensions from "../styling/LeafDimensions";
import LeafColor from "../styling/color/LeafColor";
import { useState } from "react";

interface Props {
    worker: Worker;
    style?: ViewStyle;
}

const AllocateNurseToPatientCard: React.FC<Props> = ({ worker, style }) => {
    // check if allocate button is clicked (false=white, true=green)
    const [active, setActive] = useState(false);
    const idText = worker.id.toString();

    const onPressAllocate = (worker) => {
        //TODO: set allocate nurse to patient
        //TODO: Update patient allocated counter
    };

    return (
        <FloatingContainer color={LeafColors.textBackgroundLight} style={style}>
            <HStack>
                <VStack
                    spacing={LeafDimensions.screenSpacing}
                    style={{
                        flex: 1,}}
                >
                    <View style={{ alignSelf: "flex-start" }}>
                        <LeafText typography={LeafTypography.title3} verticalWrap={true}>
                            {worker.firstName}
                        </LeafText>
                    </View>

                    <VGap size={6} />

                    <LeafText style={{ alignSelf: "flex-start" }} typography={LeafTypography.subscript} wide={false}>
                        {"ID: " + idText}
                    </LeafText>
                    <LeafText typography={LeafTypography.subscript}>
                        {worker.allocatedPatients.length + " allocated"}
                    </LeafText>
                </VStack>

                <LeafButton
                    label={strings("button.allocate")}
                    wide={false}
                    typography={LeafTypography.title3}
                    type={LeafButtonType.Filled}
                    color={LeafColors.transparent}
                    onPress={() => {
                        // change background color of allocate button to green (active = true)
                        setActive(!active);
                        onPressAllocate(worker);
                    }}
                    style={{
                        alignSelf: "center",
                        marginRight: 12,
                        borderWidth: 3,
                        borderColor: "#3f4169",
                        backgroundColor: active ? "#7fff00": "white"
                    }}
                />
            </HStack>
        </FloatingContainer>
    );
};

export default AllocateNurseToPatientCard;