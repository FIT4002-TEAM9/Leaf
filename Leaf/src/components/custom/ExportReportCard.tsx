import React from "react";
import { View, ViewStyle, TouchableOpacity } from "react-native";
import { Report } from "../../preset_data/ReportData";
import LeafText from "../base/LeafText/LeafText";
import FlatContainer from "../containers/FlatContainer";
import HStack from "../containers/HStack";
import VStack from "../containers/VStack";
import VGap from "../containers/layout/VGap";
import LeafColors from "../styling/LeafColors";
import LeafTypography from "../styling/LeafTypography";
import LeafIcon from "../base/LeafIcon/LeafIcon";
import { LeafIconSize } from "../base/LeafIcon/LeafIconSize";
import Spacer from "../containers/layout/Spacer";

interface Props {
    report: Report;
    style?: ViewStyle;
    isSelected: boolean;
    onPress: () => void;
}

const reportTypeToIcon: { [key: string]: string } = {
    "Full Report": "file-account-outline",
    "Quick Report": "file-clock-outline",
    "Custom Report": "file-edit-outline",
};

const ExportReportCard: React.FC<Props> = ({ report, style, isSelected, onPress }) => {
    const datetimeText = `${report.date.toLocaleTimeString("en-AU", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    }).toUpperCase()}, ${report.date.toDateString()}`;

    const separator = `  |  `;
    const created = `Created: `;
    const author = `Author: `;
    const type = `Type: `;

    return (
        <TouchableOpacity onPress={onPress}>
            <FlatContainer
                color={LeafColors.fillBackgroundLight}
                style={{
                    ...style,
                    borderColor: isSelected ? LeafColors.textSuccess.getColor() : LeafColors.fillBackgroundLight.getColor(),
                    borderWidth: 2,
                }}
            >
                <HStack style={{ alignItems: "center" }}>
                    <View
                        style={{
                            borderRadius: 12,
                            padding: 8,
                            backgroundColor: LeafColors.accent.getColor(),
                            alignSelf: "flex-start",
                            marginRight: 12,
                        }}
                    >
                        <LeafIcon
                            icon={reportTypeToIcon[report.type] || "file-outline"}
                            color={LeafColors.textWhite}
                            size={LeafIconSize.Medium}
                        />
                    </View>

                    <VStack style={{ flexShrink: 1 }}>
                        <View style={{ alignSelf: "flex-start" }}>
                            <LeafText typography={LeafTypography.title3} verticalWrap={true}>
                                {report.name}
                            </LeafText>
                        </View>

                        <VGap size={16} />

                        <LeafText typography={LeafTypography.subscript}>
                            {created}{datetimeText}{separator}
                            {author}{report.creator}{separator}
                            {type}{report.type}
                        </LeafText>
                    </VStack>

                    <Spacer />
                </HStack>
            </FlatContainer>
        </TouchableOpacity>
    );
};

export default ExportReportCard;
