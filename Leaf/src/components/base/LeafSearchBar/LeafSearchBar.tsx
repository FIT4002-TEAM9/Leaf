import React, { useEffect, useRef } from "react";
import { Platform, TextInput, View, ViewStyle } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import LeafColors from "../../styling/LeafColors";
import LeafTypography from "../../styling/LeafTypography";
import LeafColor from "../../styling/color/LeafColor";
import LeafText from "../LeafText/LeafText";
import LeafIcon from "../LeafIcon/LeafIcon";
import FuzzySearchUtil from "../../../utils/FuzzySearchUtil";

interface Props<T> {
    label?: string;
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
}

function LeafSearchBar<T>({
    data,
    style,
    onTextChange,
    setData,
    textColor = LeafColors.textDark,
    color = LeafColors.textBackgroundAccent,
    dataToString,
    wide = true,
    valid = undefined,
    label = "Search",
    maxDistance = 6,
}: Props<T>) {
    useEffect(() => {
        setFilteredData(data);
    }, [data]);

    const [searchQuery, setSearchQuery] = React.useState("");
    const [filteredData, setFilteredData] = React.useState(data);
    const textInputRef = useRef<TextInput>(null);
    const typography = LeafTypography.body.withColor(textColor);
    if (valid != undefined) {
        typography.withColor(valid ? LeafColors.textSuccess : LeafColors.textError);
    }
    const labelTypography = LeafTypography.body.withColor(LeafColors.textSemiDark);

    return (
        <View
            style={[
                wide ? { width: "100%" } : { alignSelf: "center" },
                {
                    flexDirection: "row",
                    backgroundColor: color.getColor(),
                    borderRadius: 30,
                    borderColor: LeafColors.outlineTextBackgroundAccent.getColor(),
                    height: 55,
                    borderWidth: 1,
                },
            ]}
        >
            <LeafIcon
                icon="magnify"
                size={26}
                color={LeafColors.textDark}
                style={{ alignSelf: "center", display: "flex", marginTop: 14, marginLeft: 16 }}
            />

            <TouchableWithoutFeedback
                style={{
                    position: "absolute",
                    flexDirection: "row",
                    height: "100%",
                    paddingHorizontal: 6,
                    ...Platform.select({
                        web: { cursor: "text" },
                    }),
                }}
                onPress={() => {
                    if (textInputRef.current) {
                        textInputRef.current.focus();
                    }
                }}
            >
                <LeafText
                    typography={labelTypography}
                    style={{
                        alignSelf: "center",
                    }}
                >
                    {searchQuery.length == 0 ? label : ""}
                </LeafText>
            </TouchableWithoutFeedback>

            <TextInput
                ref={textInputRef}
                style={[
                    wide ? { width: "100%" } : { alignSelf: "center" },
                    {
                        paddingVertical: 12,
                        paddingHorizontal: 6,
                        ...Platform.select({
                            web: { outlineStyle: "none" },
                        }),
                    },
                    typography.getStylesheet(),
                    style,
                ]}
                onChangeText={(searchQuery) => {
                    setSearchQuery(searchQuery);
                    onTextChange(searchQuery);
                    const filtered = FuzzySearchUtil.handleSearch(searchQuery, data, dataToString, maxDistance);
                    setFilteredData(filtered);
                    setData(filtered);
                }}
                value={searchQuery}
            />
        </View>
    );
}

export default LeafSearchBar;
