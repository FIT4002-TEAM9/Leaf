import {View} from "react-native";
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
    icon: string; // https://pictogrammers.com/library/mdi/
    onPress: () => void;
}

const LargeMenuButton: React.FC<Props> = ({ label, description, size, icon, onPress }) => {
    const typography = LeafTypography.title3;
    // -20 because web is funky with scroll bars - play it safe with spacing
    // -1 because if the total width of the menu button row rounds up to an extra pixel outside the available space, the menu button that overflows that extra pixel goes to the next line
    const width = Environment.inst.getOS() == OS.Web ? (size ?? 20) - 20 : (size ?? 1) - 1;

    return (
        <FlatContainer
            onPress={onPress}
            style={{
                flex: size == undefined ? 1 : undefined,
                width: size == undefined ? undefined : width,
            }}
        >
            {/* nowrap fixes text bugging out in edge cases (e.g. portrait iPad) */}
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

export default LargeMenuButton;
