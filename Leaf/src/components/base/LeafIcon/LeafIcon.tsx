import React from "react";
import { ViewStyle, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import LeafColor from "../../styling/color/LeafColor";

interface Props {
    // Icon name (https://pictogrammers.com/library/mdi/)
    icon: string;
    // Icon fill color
    color: LeafColor;
    // Icon size
    size: number;
    // Custom style
    style?: ViewStyle;
    // Event handler for when the icon is pressed
    onPress?: () => void;  // Add the onPress prop
}

const LeafIcon: React.FC<Props> = ({ icon, color, size, style, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <Icon
                name={icon}
                size={size}
                color={color.getColor()}
                style={style}
            />
        </TouchableOpacity>
    );
};

export default LeafIcon;
