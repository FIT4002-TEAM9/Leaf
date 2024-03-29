import React, { useEffect, useState } from "react";
import { Dimensions, Modal, Pressable, View } from "react-native";
import { capitalized } from "../../../language/functions/Capitalized";
import Environment from "../../../state/environment/Environment";
import { OS } from "../../../state/environment/types/OS";
import HStack from "../../containers/HStack";
import VStack from "../../containers/VStack";
import VGap from "../../containers/layout/VGap";
import LeafColors from "../../styling/LeafColors";
import LeafTypography from "../../styling/LeafTypography";
import LeafColor from "../../styling/color/LeafColor";
import { LeafFontWeight } from "../../styling/typography/LeafFontWeight";
import LeafTypographyConfig from "../../styling/typography/LeafTypographyConfig";
import LeafButton from "../LeafButton/LeafButton";
import LeafText from "../LeafText/LeafText";
import { strings } from "../../../localisation/Strings";

interface Props {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    onCancel: () => void;
    onDone: () => void;
    backgroundColour?: LeafColor;
    title: string;
    titleTypography?: LeafTypographyConfig;
    children: any;
    cancelLabel?: string;
    doneLabel?: string;
}

export const LeafPopUp: React.FC<Props> = ({
    visible,
    setVisible,
    onCancel,
    onDone,
    backgroundColour,
    title,
    titleTypography = LeafTypography.title2.withWeight(LeafFontWeight.Bold),
    children,
    cancelLabel = undefined,
    doneLabel = undefined,
}) => {
    const [screenWidth, setScreenWidth] = useState(Environment.inst.getScreenWidth());

    useEffect(() => {
        // Add event listener
        Dimensions.addEventListener("change", () => {
            const newWidth = Environment.inst.getScreenWidth();
            setScreenWidth(newWidth);
        });
    }, []);

    const cancelTypography = LeafTypography.textButton;
    cancelTypography.weight = LeafFontWeight.Regular;
    cancelTypography.leafColor = LeafColors.mediumAccent;

    return (
        <Modal
            visible={visible}
            animationType={"fade"}
            style={{
                flex: 1,
            }}
            transparent={true}
        >
            {/* Work around for a transparent background that does not effect the child components */}
            <View
                style={{
                    flex: 1,
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    position: "absolute",
                    backgroundColor: "black",
                    opacity: 0.5,
                }}
            />

            <Pressable
                onPress={() => setVisible(false)}
                style={{
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 1,
                    flex: 1,
                }}
            >
                {/* This pressable is here to stop the pop up closing if you press on it */}
                <Pressable onPressOut={(e) => e.stopPropagation()} style={{ width: screenWidth > 800 ? "50%" : "90%" }}>
                    <VStack
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                            backgroundColor:
                                backgroundColour?.getColor() || LeafColors.fillBackgroundLightPopUp.getColor(),
                            borderRadius: 20,
                            shadowColor: LeafColors.shadow.getColor(),
                            shadowOffset: {
                                width: 0,
                                height: 4,
                            },
                            // Shadows appear sligntly differnt on web
                            shadowOpacity: Environment.inst.getOS() == OS.Web ? 0.16 : 0.12,
                            shadowRadius: Environment.inst.getOS() == OS.Web ? 12 : 7,
                        }}
                    >
                        <VStack
                            style={{
                                // padding: 20,
                                paddingHorizontal: 20,
                                paddingTop: 22,
                                paddingBottom: 32,
                                width: "100%",
                            }}
                            spacing={10}
                        >
                            <LeafText typography={titleTypography} style={{ textAlign: "center" }}>
                                {capitalized(title)}
                            </LeafText>

                            <VGap size={2} />

                            {children}
                        </VStack>

                        <HStack
                            style={{
                                paddingBottom: 20,
                                paddingHorizontal: 20,
                                width: "100%",
                            }}
                            spacing={20}
                        >
                            <LeafButton
                                label={cancelLabel ?? strings("button.cancel")}
                                onPress={onCancel}
                                typography={LeafTypography.button.withColor(LeafColors.textSemiDark)}
                                color={LeafColors.fillBackgroundLight}
                                wide={false}
                                style={{
                                    flex: 1,
                                }}
                            />

                            <LeafButton
                                label={doneLabel ?? strings("button.done")}
                                onPress={onDone}
                                wide={false}
                                style={{
                                    flex: 1,
                                }}
                            />
                        </HStack>
                    </VStack>
                </Pressable>
            </Pressable>
        </Modal>
    );
};
