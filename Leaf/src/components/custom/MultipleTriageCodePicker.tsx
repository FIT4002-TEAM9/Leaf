import React, { useEffect, useState } from "react";
import { ViewStyle } from "react-native";
import { TriageCode } from "../../model/triage/TriageCode";
import TriageCodePicker from "./TriageCodePicker";
import LeafColors from "../styling/LeafColors";
import LeafSegmentedValue from "../base/LeafSegmentedButtons/LeafSegmentedValue";

interface Props {
    style?: ViewStyle;
    onSelection: (codes: TriageCode[]) => void;
    initialValue?: TriageCode[];
}

const MultipleTriageCodePicker: React.FC<Props> = ({ style, onSelection, initialValue }) => {
    // Initialize state for selected triage codes
    const [selectedCodes, setSelectedCodes] = useState<TriageCode[]>(initialValue || []);

    // Function to handle selection of triage codes
    const handleTriageCodeSelection = (code: TriageCode | undefined) => {
        if (!code) {
            return;
        }

        setSelectedCodes((prevSelectedCodes) => {
            // Check if the code is already selected
            const isCodeSelected = prevSelectedCodes.some(
                (c) => c.id === code.id
            );

            if (isCodeSelected) {
                // If the code is already selected, remove it from the array
                return prevSelectedCodes.filter(
                    (c) => c.id !== code.id
                );
            } else {
                // If the code is not selected, add it to the array
                return [...prevSelectedCodes, code];
            }
        });
    };

    // Notify parent of selection change whenever selected codes change
    useEffect(() => {
        onSelection(selectedCodes);
    }, [selectedCodes]);

    return (
        <div>
            {/* Render the existing TriageCodePicker multiple times */}
            {selectedCodes.map((code) => (
                <TriageCodePicker
                    key={code.id}
                    style={{ ...style, paddingBottom: 8 }}
                    onSelection={handleTriageCodeSelection}
                    initialValue={code}
                />
            ))}
        </div>
    );
};

export default MultipleTriageCodePicker;
