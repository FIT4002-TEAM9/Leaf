import React, { useEffect, useRef, useState } from "react";
import { Platform, View, ViewStyle, TextInput, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import LeafColors from "../../styling/LeafColors";
import LeafTypography from "../../styling/LeafTypography";
import LeafColor from "../../styling/color/LeafColor";
import LeafText from "../LeafText/LeafText";
import StateManager from "../../../state/publishers/StateManager";
import LeafIcon from "../LeafIcon/LeafIcon";
import { LeafIconSize } from "../LeafIcon/LeafIconSize";

interface Props {
    label: string;
    textColor?: LeafColor;
    color?: LeafColor;
    wide?: boolean;
    valid?: boolean;
    style?: ViewStyle;
    onTextChange: (text: string) => void;
}

const LeafPasswordInput: React.FC<Props> = ({
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
    const textInputRef = useRef<TextInput>(null);
    const typography = LeafTypography.body.withColor(textColor);
    const [isPasswordShown, setIsPasswordShown] = useState(true);
    if (valid != undefined) {
        typography.withColor(valid ? LeafColors.textSuccess : LeafColors.textError);
    }
    const labelTypography = LeafTypography.body.withColor(LeafColors.textSemiDark);

    useEffect(() => {
        const unsubscribe = StateManager.clearAllInputs.subscribe(() => {
            setText("");
            onTextChange("");
        });

        return () => {
            unsubscribe();
        };
    }, []);

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
                onPress={() => {
                    if (textInputRef.current) {
                        textInputRef.current.focus();
                    }
                }}
            >
                <View
                    style={{
                        position: "absolute",
                        flexDirection: "row",
                        height: "100%",
                        paddingHorizontal: 16,
                        ...Platform.select({
                            web: { cursor: "text" },
                        }),
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
                </View>
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
                secureTextEntry={isPasswordShown}
            />

            <TouchableOpacity
                style={{
                    position: "absolute",
                    padding: 3,
                    right: 12,
                    alignSelf: "center",
                    zIndex: 1,
                }}
                onPress={() => setIsPasswordShown(!isPasswordShown)}
            >
                <LeafIcon
                    icon={isPasswordShown ? "eye" : "eye-off"}
                    size={LeafIconSize.Small}
                    color={LeafColors.shadow}
                    onPress={() => setIsPasswordShown(!isPasswordShown)}
                />
            </TouchableOpacity>
        </View>
    );
};

export default LeafPasswordInput;
