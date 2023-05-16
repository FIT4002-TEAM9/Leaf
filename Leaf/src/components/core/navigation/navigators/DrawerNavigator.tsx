import React, { useEffect, useState } from "react"
import { createDrawerNavigator } from "@react-navigation/drawer"
import { StackWrapper } from "../impl/RenderStack"
import LeafColors from "../../styles/LeafColors"
import Environment from "../../../../state/environment/Environment"
import { LeafScreenOrientation } from "../../../../state/environment/types/LeafScreenOrientation"
import { Dimensions } from "react-native"
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import LeafStack from "../LeafStack";
import StateManager from "../../../../state/publishers/StateManager";
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LeafText from "../../views/LeafText/LeafText"
import LeafTypography from "../../styles/LeafTypography"
import { LeafFontWeight } from "../../styles/typography/LeafFontWeight"
import { strings } from "../../../../localisation/Strings"

interface Props {
    stacks: LeafStack[]
}


const CustomDrawerContent = (props) => {
    return (
        <DrawerContentScrollView {...props}>
            <LeafText style={{ paddingLeft: 5 }} typography={LeafTypography.header}> {strings("appName")} </LeafText>
            <DrawerItemList {...props} />
        </DrawerContentScrollView>
    );
}

const Drawer = createDrawerNavigator()
  
export const DrawerNavigator: React.FC<Props> = ({ stacks }) => {

    const getDrawerType = (): 'front' | 'slide' | 'back' | 'permanent' => {
        return Environment.instance.getScreenOrientation() == LeafScreenOrientation.Landscape ? 'permanent' : 'front';
    }
    const [ drawerType, setDrawerType ] = useState(getDrawerType());
    const navigation = useNavigation();

    // We only want to add the listener once, when the drawer is mounted
    useEffect(() => {
        const handleDimensionChange = () => {
            const newDrawerType = getDrawerType();
            setDrawerType(newDrawerType);

            if (newDrawerType !== 'permanent') {
                navigation.dispatch(DrawerActions.openDrawer());
            }
        };

        Dimensions.addEventListener('change', handleDimensionChange)
    }, []);

    // Update StateManager.drawerItemChanged
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('state', () => {
            let state = navigation.getState();
            if (state != undefined && state.index != StateManager.drawerItemChanged.read()) {
                StateManager.drawerItemChanged.publish(state.index);
            }
        });
        return unsubscribe;
    }, []);

    let drawerLabelTypograhy = LeafTypography.body;
    drawerLabelTypograhy.weight = LeafFontWeight.semiBold;
    drawerLabelTypograhy.leafColor = undefined; // Allow drawer to decide

    return (
        <Drawer.Navigator
            screenOptions={{
                headerShown: false,
                drawerType: drawerType,
                drawerStyle: {
                    backgroundColor: LeafColors.screenBackgroundLight.getColor(),
                    width: Environment.instance.getScreenOrientation() == LeafScreenOrientation.Landscape ? Environment.instance.getScreenWidth() * 0.2 : Environment.instance.getScreenWidth() * 0.3
                },
                // TODO: Extract into accentBackgroundColor
                drawerActiveBackgroundColor:  "#f1edfc",
                drawerActiveTintColor: LeafColors.accent.getColor(),
                drawerItemStyle: {
                    borderRadius: 16,
                },
                drawerLabelStyle: {
                    ...drawerLabelTypograhy.getStylesheet(),
                }
            }}
            drawerContent={props => <CustomDrawerContent {...props} />}
        >
            {
                stacks.map(stack => 
                    <Drawer.Screen 
                        name={stack.stackName} 
                        key={stack.stackName} 
                        component={StackWrapper(stack)}
                        options={{
                            drawerIcon: ({ color, size, focused }) => (
                                <Icon 
                                    name={focused ? stack.focusedIcon : stack.icon} 
                                    color={focused ? LeafColors.accent.getColor() : color} 
                                    size={size}
                                    style={{
                                        // TODO: Not sure how this is supposed to be accomplished
                                        // (A bit hacky)
                                        paddingLeft: 8,
                                        marginRight: -16,
                                    }} 
                                />
                            )
                        }}
                    />
                )
            }
        </Drawer.Navigator>
    )
}