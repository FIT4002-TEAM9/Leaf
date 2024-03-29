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

/*
// EXAMPLE

const [segmentedValue, setSegmentedValue] = React.useState<LeafSegmentedValue | null>(null);
const onSetSegmentedValue = (segmentedValue) => {
    // Do something with value (segmentedValue.value)
    // ...
    setSegmentedValue(segmentedValue);
}

// ...

<LeafSegmentedButtons 
    label={"Hello Segmented"}
    options={[new LeafSegmentedValue(0, "Hello"), new LeafSegmentedValue(1, "World")]}
    value={segmentedValue}
    onSetValue={onSetSegmentedValue}
/>
 */

interface Props {
    options: LeafSegmentedValue[];
    value: LeafSegmentedValue | undefined;
    selectedLabelColor?: LeafColor;
    selectedBackgroundColor?: LeafColor;
    label: string;
    labeled?: boolean;
    valueLabel?: string;
    style?: ViewStyle;
    onSetValue: (value: LeafSegmentedValue | undefined) => void;
    locked?: boolean;
    clearSelectionAllowed?: boolean;
}

const LeafSegmentedButtons: React.FC<Props> = ({
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
    const [selectedOption, setSelectedOption] = useState<LeafSegmentedValue | undefined>(value);

    useEffect(() => {
        if (clearSelectionAllowed) {
            const unsubscribe = StateManager.clearAllInputs.subscribe(() => {
                setSelectedOption(undefined);
                onSetValue(undefined);
            });

            return () => {
                unsubscribe();
            };
        }
    }, []);

    return (
        <VStack
            style={{
                width: "100%",
                ...style,
            }}
        >
            {labeled ? (
                <HStack
                    style={{
                        width: "100%",
                    }}
                >
                    <LeafText typography={LeafTypography.subscript} wide={false}>
                        {label}
                    </LeafText>

                    <Spacer />

                    <LeafText typography={LeafTypography.subscript.withColor(selectedBackgroundColor)} wide={false}>
                        {valueLabel ?? selectedOption?.label ?? ""}
                    </LeafText>
                </HStack>
            ) : null}

            <VGap size={8} />

            <HStack
                spacing={8}
                style={{
                    width: "100%",
                }}
            >
                {options.map((option) => {
                    return (
                        <FlatContainer
                            key={option.id}
                            style={{
                                flex: 1,
                                paddingVertical: 16,
                            }}
                            onPress={() => {
                                if (!locked) {
                                    setSelectedOption(option);
                                    onSetValue(option);
                                }
                            }}
                            color={(selectedOption?.id ?? "") == option.id ? selectedBackgroundColor : undefined}
                        >
                            <LeafText
                                wide={false}
                                style={{
                                    color:
                                        (selectedOption?.id ?? "") == option.id
                                            ? selectedLabelColor.getColor()
                                            : undefined,
                                }}
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

export default LeafSegmentedButtons;
