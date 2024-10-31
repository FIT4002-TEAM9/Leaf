import { useEffect, useState } from "react";
import { ViewStyle } from "react-native";
import { strings } from "../../localisation/Strings";
import { TriageCode } from "../../model/triage/TriageCode";
import LeafSegmentedButtonsModified from "../base/LeafSegmentedButtons/LeafSegmentedButtonsModified";
import LeafSegmentedValue from "../base/LeafSegmentedButtons/LeafSegmentedValue";
import StateManager from "../../state/publishers/StateManager";

interface Props {
    style?: ViewStyle;
    onSelection: (codes: TriageCode[]) => void; // Handle an array of TriageCode
    initialValue?: TriageCode[];
}

const TriageCodePickerModified: React.FC<Props> = ({ style, onSelection, initialValue }) => {
    // State for selected triage codes
    const [segmentedValues, setSegmentedValues] = useState<LeafSegmentedValue[]>(
        initialValue?.map(code => new LeafSegmentedValue(code, code.code.toString())) || []
    );

    // Function to handle the addition or removal of selected values
    const handleSetSegmentedValues = (selectedValues: LeafSegmentedValue[]) => {
        setSegmentedValues(selectedValues);
        onSelection(selectedValues.map(value => value.value));
    };

    // Handle clearAllInputs subscription and update state accordingly
    useEffect(() => {
        const unsubscribe = StateManager.clearAllInputs.subscribe(() => {
            setSegmentedValues([]);
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
            label={strings("inputLabel.triageCode")}
            valueLabel={segmentedValues.map(value => value.value.toString()).join(", ")}
            options={[
                new LeafSegmentedValue(TriageCode.immediate, TriageCode.immediate.code.toString()),
                new LeafSegmentedValue(TriageCode.emergency, TriageCode.emergency.code.toString()),
                new LeafSegmentedValue(TriageCode.urgent, TriageCode.urgent.code.toString()),
                new LeafSegmentedValue(TriageCode.semiUrgent, TriageCode.semiUrgent.code.toString()),
                new LeafSegmentedValue(TriageCode.nonUrgent, TriageCode.nonUrgent.code.toString()),
            ]}
            value={segmentedValues}
            onSetValue={handleSetSegmentedValues}
            style={style}
        />
    );
};

export default TriageCodePickerModified;
