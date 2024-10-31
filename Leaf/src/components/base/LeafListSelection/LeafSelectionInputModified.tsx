import React, { useEffect } from "react";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { ViewStyle } from "react-native";
import LeafSelectionItem from "./LeafSelectionItem";
import FlatContainer from "../../containers/FlatContainer";
import HStack from "../../containers/HStack";
import LeafText from "../LeafText/LeafText";
import LeafTypography from "../../styling/LeafTypography";
import VStack from "../../containers/VStack";
import LeafIcon from "../LeafIcon/LeafIcon";
import { LeafIconSize } from "../LeafIcon/LeafIconSize";
import LeafColors from "../../styling/LeafColors";
import Spacer from "../../containers/layout/Spacer";
import NavigationSession from "../../navigation/state/NavigationEnvironment";
import LeafListSelection from "./LeafListSelection";
import LeafListSelectionManager from "./LeafListSelectionManager";
import { strings } from "../../../localisation/Strings";
import StateManager from "../../../state/publishers/StateManager";

interface Props<T> {
    navigation?: NavigationProp<ParamListBase>;
    selected: LeafSelectionItem<T> | undefined;
    items: LeafSelectionItem<T>[];
    title: string;
    style?: ViewStyle;
    disabled?: boolean;
    onSelection: (item: LeafSelectionItem<T> | undefined) => void;
}

const LeafSelectionInput: React.FC<Props<unknown>> = ({
    navigation,
    selected,
    items,
    title,
    style,
    disabled = false,
    onSelection,
}) => {
    const isSelected = selected != null;

    useEffect(() => {
        const unsubscribe = StateManager.clearAllInputs.subscribe(() => {
            onSelection(undefined);
        });

        return () => {
            unsubscribe();
        };
    }, [onSelection]);

    // Handle the icon press
    const handleIconPress = () => {
        // If an item is selected and the 'close' icon is pressed, clear the selection
        if (isSelected && !disabled) {
            onSelection(undefined);
        }
    };

    // Handle the button press
    const handleButtonPress = () => {
        // If the button is pressed, navigate to the selection screen
        if (!disabled) {
            LeafListSelectionManager.listSelection = items;
            LeafListSelectionManager.onSelection = onSelection;
            NavigationSession.inst.navigateTo(LeafListSelection, navigation, title);
        }
    };

    return (
        <FlatContainer
            onPress={handleButtonPress}
            style={{ width: "100%", ...style }}
            color={LeafColors.fillBackgroundLight}
        >
            <HStack>
                <VStack spacing={4}>
                    <LeafText typography={LeafTypography.subscript.withColor(LeafColors.textSemiDark)}>
                        {title}
                    </LeafText>
                    <LeafText
                        typography={LeafTypography.body.withColor(
                            selected == undefined ? LeafColors.textError : LeafColors.textDark,
                        )}
                    >
                        {disabled && selected == undefined ? "Select Hospital Site" : selected?.title ?? ""}
                    </LeafText>
                </VStack>

                <Spacer />

                {/* Icon to prompt the selection window */}
                <LeafIcon
                    icon={isSelected ? "close" : "chevron-right-circle"}
                    color={isSelected ? LeafColors.textSemiDark : LeafColors.textSemiDark}
                    size={LeafIconSize.Large}
                    style={{ alignSelf: "center" }}
                    onPress={isSelected ? handleIconPress : handleButtonPress} // Use handleButtonPress when chevron icon is clicked
                />
            </HStack>
        </FlatContainer>
    );
};

export default LeafSelectionInput;
