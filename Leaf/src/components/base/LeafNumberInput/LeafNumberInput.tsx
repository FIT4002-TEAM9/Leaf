import LeafColor from "../../styling/color/LeafColor";
import { Platform, TextInput, ViewStyle } from "react-native";
import LeafColors from "../../styling/LeafColors";
import React, { useEffect, useRef, useState } from "react";
import LeafTypography from "../../styling/LeafTypography";
import StateManager from "../../../state/publishers/StateManager";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import VStack from "../../containers/VStack";
import LeafText from "../LeafText/LeafText";

interface Props {
  label: string;
  textColor?: LeafColor;
  color?: LeafColor;
  wide?: boolean;
  valid?: boolean;
  style?: ViewStyle;
  onChange: (number: number) => void;
  initialValue?: number;
  locked?: boolean;
  lockedColor?: LeafColor;
}

const LeafNumberInput: React.FC<Props> = ({
    label,
    textColor = LeafColors.textDark,
    color = LeafColors.textBackgroundDark,
    wide = true,
    valid = undefined,
    style,
    onChange,
    initialValue,
    locked = false,
    lockedColor = LeafColors.textBackgroundLight,
}) => {
    const [number, setNumber] = useState(initialValue ?? 0);
    const [currentTextColor, setCurrentTextColor] = useState(textColor);
    const [borderColor, setBorderColor] = useState(color);
    const [isFocused, setIsFocused] = useState(false);
    const borderWidth = 2.0;
    const textInputRef = useRef<TextInput>(null);
    const typography = LeafTypography.body.withColor(textColor);
    const labelTypography = LeafTypography.subscript;
    const labelColor =
        valid == undefined
            ? labelTypography.color
            : valid
                ? LeafColors.textSuccess.getColor()
                : LeafColors.textError.getColor();

    const validateText = (text: string): boolean => {
      return Number(text) !== undefined;
    };

    const maskText = (text: string): string => {
      return text.replace(/\D/g, ""); // Remove any non-digit characters
    };

    const onTextChange = (text: string) => {
      if (!locked) {
        onChange(Number(text));
        if (!validateText(text)) {
          setBorderColor(LeafColors.textError);
          setCurrentTextColor(LeafColors.textError);
        } else {
          setBorderColor(color);
          setCurrentTextColor(textColor);
        }
      }
    };

    useEffect(() => {
      const unsubscribe = StateManager.clearAllInputs.subscribe(() => {
        setNumber(0);
        onChange(0);
      });

      return () => {
        unsubscribe();
      };
    }, []);

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
              borderColor: isFocused ? typography.color : borderColor.getColor(),
              borderWidth: borderWidth,
            }}
        >
          <LeafText typography={labelTypography} style={{ color: labelColor }}>
            {label}
          </LeafText>

          <TextInput
              ref={textInputRef}
              style={[
                {
                  backgroundColor: !locked ? color.getColor() : lockedColor.getColor(),
                  ...Platform.select({
                    web: { outlineStyle: "none" },
                  }),
                  color: currentTextColor.getColor(),
                },
                typography.getStylesheet(),
                style,
              ]}
              onChangeText={(text) => {
                if (!locked) {
                  setNumber(Number(maskText(text)));
                  onTextChange(text);
                }
              }}
              keyboardType={"numeric"}
              value={number.toString()}
              onFocus={() => (!locked ? setIsFocused(true) : null)}
              onBlur={() => setIsFocused(false)}
              editable={!locked}
          />
        </VStack>
      </TouchableWithoutFeedback>
  );
};

export default LeafNumberInput;
