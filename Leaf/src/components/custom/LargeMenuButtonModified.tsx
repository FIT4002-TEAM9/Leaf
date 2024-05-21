import React from "react";
import { ViewStyle, View } from "react-native";
import Environment from "../../state/environment/Environment";
import { OS } from "../../state/environment/types/OS";
import LeafIcon from "../base/LeafIcon/LeafIcon";
import { LeafIconSize } from "../base/LeafIcon/LeafIconSize";
import LeafText from "../base/LeafText/LeafText";
import FlatContainer from "../containers/FlatContainer";
import VStack from "../containers/VStack";
import VGap from "../containers/layout/VGap";
import LeafColors from "../styling/LeafColors";
import LeafTypography from "../styling/LeafTypography";

interface Props {
    label: string;
    description: string;
    size?: number;
    icon: string; // Icon name from a library
    onPress: () => void;
    onSelect: () => void; // Function to handle selection
    isSelected: boolean; // Indicates if the button is selected
}

const LargeMenuButtonModified: React.FC<Props> = ({
    label,
    description,
    size,
    icon,
    onPress,
    onSelect,
    isSelected,
}) => {
    const typography = LeafTypography.title3;

    // Determine width based on the platform and provided size
    const width = Environment.inst.getOS() == OS.Web ? (size ?? 20) - 20 : (size ?? 1) - 1;

    // Set the style of the FlatContainer
    const flatContainerStyle: ViewStyle = {
        flex: size == undefined ? 1 : undefined,
        width: size == undefined ? undefined : width,
        borderWidth: 3, // Always set border width to 3
        // If the button is selected, use LeafColors.textSuccess.getColor() for the border color
        // If the button is not selected, use LeafColors.fillBackgroundLight.getColor() (same as background color)
        borderColor: isSelected ? LeafColors.textSuccess.getColor() : LeafColors.fillBackgroundLight.getColor(),
        backgroundColor: LeafColors.fillBackgroundLight.getColor(),
    };

    return (
        <FlatContainer
            onPress={() => {
                onPress();
                onSelect(); // Call the onSelect function when the button is pressed
            }}
            style={flatContainerStyle}
        >
            <VStack style={{ flexWrap: "nowrap" }}>
                <View
                    style={{
                        borderRadius: 12,
                        padding: 8,
                        backgroundColor: LeafColors.accent.getColor(),
                        alignSelf: "flex-start",
                    }}
                >
                    <LeafIcon icon={icon} color={LeafColors.textWhite} size={LeafIconSize.Medium} />
                </View>

                <VGap size={20} />

                <LeafText typography={typography}>{label}</LeafText>

                <VGap size={5} />

                <LeafText typography={LeafTypography.subscript}>{description}</LeafText>
            </VStack>
        </FlatContainer>
    );
};

export default LargeMenuButtonModified;
