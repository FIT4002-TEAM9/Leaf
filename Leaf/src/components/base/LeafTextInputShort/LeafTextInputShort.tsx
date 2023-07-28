import React, { useRef, useState } from "react";
import { Platform, TextInput, View, ViewStyle } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import LeafColors from "../../styling/LeafColors";
import LeafTypography from "../../styling/LeafTypography";
import LeafColor from "../../styling/color/LeafColor";
import LeafText from "../LeafText/LeafText";

interface Props {
    label: string;
    textColor?: LeafColor;
    color?: LeafColor;
    wide?: boolean;
    valid?: boolean;
    style?: ViewStyle;
    onTextChange: (text: string) => void;
}

const LeafTextInputShort: React.FC<Props> = ({
    label,
    textColor = LeafColors.textDark,
    color = LeafColors.textBackgroundDark,
    wide = true,
    valid = undefined,
    style,
    onTextChange,
}) => {
    const [text, setText] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const borderWidth = 2.0;
    const textInputRef = useRef(null);
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
                    borderRadius: 12,
                    borderColor: isFocused ? typography.color : color.getColor(),
                    borderWidth: borderWidth,
                },
            ]}
        >
            <TouchableWithoutFeedback
                style={{
                    position: "absolute",
                    flexDirection: "row",
                    height: "100%",
                    paddingHorizontal: 16,
                    ...Platform.select({
                        web: { cursor: "text" },
                    }),
                }}
                onPress={() => {
                    textInputRef.current.focus();
                }}
            >
                <LeafText
                    typography={labelTypography}
                    style={{
                        alignSelf: "center",
                    }}
                >
                    {text.length == 0 ? label : ""}
                </LeafText>
            </TouchableWithoutFeedback>

            <TextInput
                ref={textInputRef}
                style={[
                    wide ? { width: "100%" } : { alignSelf: "center" },
                    {
                        paddingVertical: 12,
                        paddingHorizontal: 16,
                        ...Platform.select({
                            web: { outlineStyle: "none" },
                        }),
                    },
                    typography.getStylesheet(),
                    style,
                ]}
                onChangeText={(text) => {
                    setText(text);
                    onTextChange(text);
                }}
                value={text}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />
        </View>
    );
};

export default LeafTextInputShort;
