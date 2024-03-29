import React from "react";
import { View, TouchableWithoutFeedback } from "react-native";
import LeafIcon from "../../base/LeafIcon/LeafIcon";
import LeafText from "../../base/LeafText/LeafText";
import VStack from "../../containers/VStack";
import LeafInterfaceSection from "../LeafInterfaceSection";
import NavigationSession from "../state/NavigationEnvironment";
import LeafColors from "../../styling/LeafColors";
import LeafTypography from "../../styling/LeafTypography";
import { LeafIconSize } from "../../base/LeafIcon/LeafIconSize";

interface Props {
    interfaceSection: LeafInterfaceSection;
}

const TabBarItem: React.FC<Props> = ({ interfaceSection }) => {
    const isFocused =
        NavigationSession.inst.focusedInterfaceSection != undefined &&
        NavigationSession.inst.focusedInterfaceSection.matches(interfaceSection.id);
    const icon = isFocused ? interfaceSection.focusedIcon : interfaceSection.icon;
    const color = isFocused ? LeafColors.textDark : LeafColors.textSemiDark;
    const size = LeafIconSize.Medium;
    const padding = 10;
    return (
        <VStack
            spacing={5}
            style={{
                alignItems: "center",
                alignSelf: "flex-start",
                paddingBottom: 8,
            }}
        >
            <TouchableWithoutFeedback onPress={interfaceSection.activateOnTabBar}>
                {/* Nest view to ensure compatability with Android */}
                <View style={{ paddingVertical: padding, paddingHorizontal: 30 }}>
                    <LeafIcon icon={icon} color={color} size={size} />
                </View>
            </TouchableWithoutFeedback>

            <View
                style={{
                    position: "absolute",
                    top: size + padding + 4,
                    flex: 1,
                }}
            >
                <LeafText
                    typography={LeafTypography.subscriptLabel.withColor(color)}
                    style={{ alignSelf: "center", textAlign: "center" }}
                >
                    {interfaceSection.title}
                </LeafText>
            </View>
        </VStack>
    );
};

export default TabBarItem;
