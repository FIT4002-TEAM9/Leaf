import React, { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FlatContainer from "../../containers/FlatContainer";
import LeafText from "../LeafText/LeafText";
import VStack from "../../containers/VStack";
import LeafTypography from "../../styling/LeafTypography";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import LeafColor from "../../styling/color/LeafColor";
import HStack from "../../containers/HStack";
import LeafColors from "../../styling/LeafColors";
import HGap from "../../containers/layout/HGap";

interface NotificationProps {
    title: string;
    message: string;
    titleColor?: LeafColor;
    messageColor?: LeafColor;
    icon?: string;
    iconColor?: LeafColor;
    backgroundColor?: LeafColor;
    onAnimationEnd: () => void;
}

const Notification: React.FC<NotificationProps> = ({
    title,
    message,
    titleColor = LeafColors.textDark,
    messageColor = LeafColors.textSemiDark,
    icon = "",
    iconColor = LeafColors.textDark,
    backgroundColor,
    onAnimationEnd,
}) => {
    const translateY = useRef(new Animated.Value(-100)).current;

    useEffect(() => {
        Animated.timing(translateY, {
            toValue: 0,
            duration: 300,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false,
        }).start(() => {
            // Wait for a duration and then trigger the slide-out animation
            setTimeout(() => {
                Animated.timing(translateY, {
                    toValue: -200,
                    duration: 300,
                    easing: Easing.in(Easing.cubic),
                    useNativeDriver: false,
                }).start(() => {
                    onAnimationEnd();
                });
            }, 1500); // Auto-hide after 1.5 seconds
        });
    }, [translateY, onAnimationEnd]);

    const insets = useSafeAreaInsets();

    return (
        <Animated.View
            style={[
                // eslint-disable-next-line react-native/no-color-literals
                {
                    backgroundColor: "transparent",
                    marginTop: insets.top,
                    padding: 10,
                    flexDirection: "row",
                    justifyContent: "center",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 9999, // Ensure the notification is on top of everything
                },
                { transform: [{ translateY }] },
            ]}
        >
            <FlatContainer color={backgroundColor} style={{ maxWidth: 350 }}>
                <HStack spacing={16} style={{ flexWrap: "nowrap" }}>
                    {icon == undefined ? (
                        <HGap size={32} />
                    ) : (
                        <Icon
                            name={icon}
                            size={40}
                            color={iconColor.getColor()}
                            style={{ alignSelf: "center", paddingLeft: 8 }}
                        />
                    )}

                    <VStack spacing={6} style={{ paddingRight: 32, maxWidth: 200 }}>
                        <LeafText
                            typography={LeafTypography.title3.withColor(titleColor)}
                            wide={false}
                            style={{ alignSelf: "flex-start" }}
                        >
                            {title}
                        </LeafText>

                        <LeafText
                            typography={LeafTypography.subscript.withColor(messageColor)}
                            wide={false}
                            style={{ alignSelf: "flex-start" }}
                        >
                            {message}
                        </LeafText>
                    </VStack>
                </HStack>
            </FlatContainer>
        </Animated.View>
    );
};

export default Notification;
