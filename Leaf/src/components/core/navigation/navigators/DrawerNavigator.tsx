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
import LeafDimensions from "../../styles/LeafDimensions"
import LeafIcon from "../../views/LeafIcon/LeafIcon"
import { LeafIconSize } from "../../views/LeafIcon/LeafIconSize"
import { HStack } from "native-base"

interface Props {
    stacks: LeafStack[]
}


const CustomDrawerContent = (props) => {
    return (
        <DrawerContentScrollView {...props}>
            <HStack paddingLeft={5}>
                <LeafIcon 
                    icon="clipboard-list" 
                    color={LeafTypography.header.leafColor} 
                    size={LeafIconSize.header} 
                    style={{alignSelf: 'center'}} 
                />

                <LeafText typography={LeafTypography.header}> {strings("appName")} </LeafText>
            </HStack>

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

    // Internal state storing height and width properties of the window
    const [windowSize, setWindowSize] = React.useState({ 
        height: window.innerHeight,
        width: window.innerWidth
    });

    React.useEffect(() =>  {
        // Set new state for windowSize, containing height and width of window
        const renderOnResize = () => {
            setWindowSize({
                height: window.innerHeight,
                width: window.innerWidth
            })
        };
        // Trigger setWindowSize() when resize is detected
        window.addEventListener('resize', renderOnResize);

        // Cleanup to avoid memory leaks
        return _ => {window.removeEventListener('resize', renderOnResize)};
    });

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
                drawerActiveBackgroundColor:  LeafColors.fillBackgroundAccent.getColor(),
                drawerActiveTintColor: LeafColors.accent.getColor(),
                drawerItemStyle: {
                    borderRadius: LeafDimensions.fillRadius,
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