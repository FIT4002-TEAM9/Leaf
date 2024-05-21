import React, { useEffect, useState } from "react";
import { ViewStyle } from "react-native";
import FlatContainer from "../../containers/FlatContainer";
import HStack from "../../containers/HStack";
import VStack from "../../containers/VStack";
import Spacer from "../../containers/layout/Spacer";
import VGap from "../../containers/layout/VGap";
import LeafColors from "../../styling/LeafColors";
import LeafTypography from "../../styling/LeafTypography";
import LeafColor from "../../styling/color/LeafColor";
import LeafText from "../LeafText/LeafText";
import LeafSegmentedValue from "./LeafSegmentedValue";
import StateManager from "../../../state/publishers/StateManager";

interface Props {
    options: LeafSegmentedValue[];
    value: LeafSegmentedValue[];
    selectedLabelColor?: LeafColor;
    selectedBackgroundColor?: LeafColor;
    label: string;
    labeled?: boolean;
    valueLabel?: string;
    style?: ViewStyle;
    onSetValue: (values: LeafSegmentedValue[]) => void;
    locked?: boolean;
    clearSelectionAllowed?: boolean;
}

const LeafSegmentedButtonsModified: React.FC<Props> = ({
    options,
    value,
    selectedLabelColor = LeafColors.textLight,
    selectedBackgroundColor = LeafColors.textDark,
    label,
    labeled = true,
    valueLabel,
    style,
    onSetValue,
    locked = false,
    clearSelectionAllowed = true,
}) => {
    // State for managing selected values
    const [selectedValues, setSelectedValues] = useState<LeafSegmentedValue[]>(value);

    // Update selected values when the prop changes
    useEffect(() => {
        setSelectedValues(value);
    }, [value]);

    const handleOptionPress = (option: LeafSegmentedValue) => {
        if (locked) return;

        // Check if the option is already selected
        const isSelected = selectedValues.some((v) => v.id === option.id);
        let updatedValues;

        if (isSelected) {
            // Remove the selected value if already selected
            updatedValues = selectedValues.filter((v) => v.id !== option.id);
        } else {
            // Add the new value to the list of selected values
            updatedValues = [...selectedValues, option];
        }

        // Update the state and notify parent of the change
        setSelectedValues(updatedValues);
        onSetValue(updatedValues);
    };

    return (
        <VStack style={{ width: "100%", ...style }}>
            {labeled && (
                <HStack style={{ width: "100%" }}>
                    <LeafText typography={LeafTypography.subscript} wide={false}>
                        {label}
                    </LeafText>

                    <Spacer />

                    <LeafText
                        typography={LeafTypography.subscript.withColor(selectedBackgroundColor)}
                        wide={false}
                    >
                        {valueLabel ?? selectedValues.map((v) => v.label).join(", ")}
                    </LeafText>
                </HStack>
            )}

            <VGap size={8} />

            <HStack spacing={8} style={{ width: "100%" }}>
                {options.map((option) => {
                    // Check if the current option is selected
                    const isSelected = selectedValues.some((v) => v.id === option.id);

                    return (
                        <FlatContainer
                            key={option.id}
                            style={{ flex: 1, paddingVertical: 16 }}
                            onPress={() => handleOptionPress(option)}
                            color={isSelected ? selectedBackgroundColor : undefined}
                        >
                            <LeafText
                                wide={false}
                                style={{ color: isSelected ? selectedLabelColor.getColor() : undefined }}
                            >
                                {option.label}
                            </LeafText>
                        </FlatContainer>
                    );
                })}
            </HStack>
        </VStack>
    );
};

export default LeafSegmentedButtonsModified;
