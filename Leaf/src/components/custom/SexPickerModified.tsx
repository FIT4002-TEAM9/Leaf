import React, { useEffect, useState } from "react";
import { ViewStyle } from "react-native";
import { strings } from "../../localisation/Strings";
import LeafSegmentedButtonsModified from "../base/LeafSegmentedButtons/LeafSegmentedButtonsModified";
import LeafSegmentedValue from "../base/LeafSegmentedButtons/LeafSegmentedValue";
import StateManager from "../../state/publishers/StateManager"; // Import StateManager
import { PatientSex } from "../../model/patient/PatientSex";

interface Props {
    style?: ViewStyle;
    onSelection: (sexes: PatientSex[]) => void; // Handle an array of PatientSex
    initialValue?: PatientSex[]; // Initial array of selected values
}

const SexPickerModified: React.FC<Props> = ({ style, onSelection, initialValue }) => {
    // State for selected sexes
    const [segmentedValues, setSegmentedValues] = useState<LeafSegmentedValue[]>(
        initialValue?.map(sex => new LeafSegmentedValue(sex, sex.toString())) || []
    );

    // Function to handle the addition or removal of selected values
    const handleSetSegmentedValues = (selectedValues: LeafSegmentedValue[]) => {
        setSegmentedValues(selectedValues);
        onSelection(selectedValues.map(value => value.value as PatientSex));
    };

    // Handle clearAllInputs subscription and update state accordingly
    useEffect(() => {
        const unsubscribe = StateManager.clearAllInputs.subscribe(() => {
            setSegmentedValues([]); // Clear the selection
            onSelection([]); // Notify parent of change
        });

        // Cleanup the subscription
        return () => {
            unsubscribe();
        };
    }, [onSelection]);

    // Render LeafSegmentedButtonsModified with appropriate props
    return (
        <LeafSegmentedButtonsModified
            label={strings("inputLabel.sex")}
            valueLabel={segmentedValues.map(value => value.value.toString()).join(", ")}
            options={[
                new LeafSegmentedValue(PatientSex.male, PatientSex.male.toString()),
                new LeafSegmentedValue(PatientSex.female, PatientSex.female.toString()),
                new LeafSegmentedValue(PatientSex.other, PatientSex.other.toString()),
            ]}
            value={segmentedValues}
            onSetValue={handleSetSegmentedValues}
            style={style}
        />
    );
};

export default SexPickerModified;
