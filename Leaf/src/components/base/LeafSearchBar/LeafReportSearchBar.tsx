import React, { useState, useRef } from "react";
import { Platform, TextInput, ViewStyle } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import HStack from "../../containers/HStack";
import VStack from "../../containers/VStack";
import LeafColor from "../../styling/color/LeafColor";
import LeafColors from "../../styling/LeafColors";
import LeafTypography from "../../styling/LeafTypography";
import LeafText from "../LeafText/LeafText";
import LeafIcon from "../LeafIcon/LeafIcon";
import FuzzySearchUtil from "../../../utils/FuzzySearchUtil";
import {strings} from "../../../localisation/Strings";

interface Props<T> {
    label: string;
    textColor?: LeafColor;
    color?: LeafColor;
    wide?: boolean;
    valid?: boolean;
    style?: ViewStyle;
    data: T[];
    onTextChange: (text: string) => void;
    setData: (data: T[]) => void;
    dataToString: (data: T) => string;
    maxDistance?: number;
    locked?: boolean;
    lockedColor?: LeafColor;
}

function LeafReportSearchBar<T>({
    label,
    data,
    style,
    onTextChange,
    setData,
    textColor = LeafColors.textDark,
    color = LeafColors.textBackgroundDark,
    dataToString,
    wide = true,
    valid = undefined,
    maxDistance = 6,
    locked = false,
    lockedColor = LeafColors.textBackgroundLight,
}: Props<T>) {
    const [searchQuery, setSearchQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const textInputRef = useRef<TextInput>(null);

    const borderWidth = 2.0;
    const typography = LeafTypography.body.withColor(textColor);
    const labelTypography = LeafTypography.subscript;
    const labelColor = valid === undefined
        ? labelTypography.color
        : valid
            ? LeafColors.textSuccess.getColor()
            : LeafColors.textError.getColor();

    const handleTextChange = (text: string) => {
        setSearchQuery(text);
        onTextChange(text);
        const filtered = FuzzySearchUtil.handleSearch(text, data, dataToString, maxDistance);
        setData(filtered);
    };

    const onFocus = () => {
        if (!locked) {
            setIsFocused(true);
        }
    };

    const onBlur = () => {
        setIsFocused(false);
    };

    return (
        <TouchableWithoutFeedback
            style={[wide ? { width: "100%" } : { alignSelf: "center" }, { flexDirection: "row" }]}
            onPress={() => {
                if (textInputRef.current) {
                    textInputRef.current.focus();
                }
            }}
        >
            <VStack
                spacing={2}
                style={{
                    width: wide ? "100%" : undefined,
                    alignSelf: wide ? undefined : "center",
                    backgroundColor: !locked ? color.getColor() : lockedColor.getColor(),
                    paddingVertical: 12 - borderWidth,
                    paddingHorizontal: 16 - borderWidth,
                    borderRadius: 12,
                    borderColor: isFocused ? typography.color : color.getColor(),
                    borderWidth: borderWidth,
                }}
            >
                <LeafText typography={labelTypography} style={{ color: labelColor }}>
                    {strings("search.underlying")}
                </LeafText>

                <HStack>
                    <LeafText typography={LeafTypography.subscriptLabel} wide={false}>
                        {strings("blankspace")}
                    </LeafText>
                </HStack>

                <HStack spacing={8} style={{ alignItems: 'center' }}>
                    <LeafIcon
                        icon="magnify"
                        size={20}
                        color={LeafColors.textDark}
                    />
                    <TextInput
                        ref={textInputRef}
                        style={[
                            {
                                flex: 1,
                                backgroundColor: !locked ? color.getColor() : lockedColor.getColor(),
                                ...Platform.select({
                                    web: { outlineStyle: "none" },
                                }),
                                color: textColor.getColor(),
                            },
                            typography.getStylesheet(),
                            style,
                        ]}
                        onChangeText={handleTextChange}
                        value={searchQuery}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        editable={!locked}
                        placeholder="Search"
                    />
                </HStack>
            </VStack>
        </TouchableWithoutFeedback>
    );
}

export default LeafReportSearchBar;