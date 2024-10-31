import React from "react";
import {View, ViewStyle, TouchableOpacity} from "react-native";
import File from "../../model/file/File";
import LeafText from "../base/LeafText/LeafText";
import FlatContainer from "../containers/FlatContainer";
import HStack from "../containers/HStack";
import VStack from "../containers/VStack";
import VGap from "../containers/layout/VGap";
import LeafColors from "../styling/LeafColors";
import LeafTypography from "../styling/LeafTypography";
import LeafIcon from "../base/LeafIcon/LeafIcon";
import {LeafIconSize} from "../base/LeafIcon/LeafIconSize";
import Spacer from "../containers/layout/Spacer";

// Define the props for the ExportReportCard component
interface Props {
    report: File; // The report file object to display
    style?: ViewStyle; // Optional custom styling for the card
    isSelected: boolean; // Flag to indicate if the card is selected
    onPress: () => void; // Function to handle card press events
}

// Map report types to corresponding icons
const reportTypeToIcon: { [key: string]: string } = {
    "Full Report": "file-account-outline", // Icon for full reports
    "Quick Report": "file-clock-outline", // Icon for quick reports
    "Custom Report": "file-edit-outline", // Icon for custom reports
};

// ExportReportCard functional component
const ExportReportCard: React.FC<Props> = ({report, style, isSelected, onPress}) => {
    // Format the report creation datetime for display
    const datetimeText = `${report.created.toLocaleTimeString("en-AU", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    }).toUpperCase()}, ${report.created.toDateString()}`;

    // Predefined text for display labels
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
                <HStack style={{alignItems: "center"}}>
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
                            icon={reportTypeToIcon[report.reportType] || "file-outline"}
                            color={LeafColors.textWhite}
                            size={LeafIconSize.Medium}
                        />
                    </View>

                    <VStack style={{flexShrink: 1}}>
                        <View style={{alignSelf: "flex-start"}}>
                            <LeafText typography={LeafTypography.title3} verticalWrap={true}>
                                {report.title}
                            </LeafText>
                        </View>

                        <VGap size={16}/>

                        <LeafText typography={LeafTypography.subscript}>
                            {created}{datetimeText}{separator}
                            {author}{report.author}{separator}
                            {type}{report.reportType}
                        </LeafText>
                    </VStack>

                    <Spacer/>
                </HStack>
            </FlatContainer>
        </TouchableOpacity>
    );
};

export default ExportReportCard;
