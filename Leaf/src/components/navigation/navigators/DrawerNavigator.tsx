import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { LayoutChangeEvent, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { strings } from "../../../localisation/Strings";
import Environment from "../../../state/environment/Environment";
import { OS } from "../../../state/environment/types/OS";
import LeafIconButton from "../../base/LeafIconButton/LeafIconButton";
import LeafText from "../../base/LeafText/LeafText";
import HStack from "../../containers/HStack";
import VStack from "../../containers/VStack";
import DrawerItem from "../components/DrawerItem";
import LeafColors from "../../styling/LeafColors";
import LeafDimensions from "../../styling/LeafDimensions";
import LeafTypography from "../../styling/LeafTypography";
import LeafHeader from "../components/CustomHeader";
import { EmptyScreen } from "../components/EmptyScreen";
import LeafInterface from "../LeafInterface";
import LeafScreen from "../LeafScreen";
import NavigationSession from "../state/NavigationEnvironment";
import NavigationStateManager from "../state/NavigationStateManager";
import Spacer from "../../containers/layout/Spacer";
import LeafButton from "../../base/LeafButton/LeafButton";
import StateManager from "../../../state/publishers/StateManager";
import { LoginStatus } from "../../../state/publishers/types/LoginStatus";
import { LeafIconSize } from "../../base/LeafIcon/LeafIconSize";

interface Props {
    leafInterface: LeafInterface;
}

const DrawerNavigator: React.FC<Props> = ({ leafInterface }) => {
    const [drawerContracted, setDrawerContracted] = useState(false);
    const [sidebar, setSidebar] = useState<JSX.Element | undefined>(undefined);
    const [screens, setScreens] = useState<LeafScreen[]>([]);

    const Stack = createStackNavigator();
    const Insets = useSafeAreaInsets();
    const PlatformIsWeb = Environment.inst.getOS() == OS.Web;

    useEffect(() => {
        NavigationSession.inst.clearScreens();

        const unsubscribeSidebar = NavigationStateManager.sidebarComponentChanged.subscribe(() => {
            setSidebar(NavigationSession.inst.sidebarComponent);
        });

        const unsubscribeStack = NavigationStateManager.screenStackUpdated.subscribe(() => {
            setScreens([...NavigationSession.inst.screens]);
        });

        return () => {
            unsubscribeSidebar();
            unsubscribeStack();
        };
    }, []);

    useEffect(() => {
        NavigationSession.inst.loadedNavigation();
        NavigationSession.inst.loadedNavigation = () => {};
    }, [screens]);

    const toggleDrawer = () => {
        setDrawerContracted(!drawerContracted);
    };

    const onLayout = (event: LayoutChangeEvent) => {
        const layout = event.nativeEvent.layout;
        if (layout.width > 0) {
            // Only if this component is visible
            // Assume the content component has screen padding
            StateManager.contentWidth.publish(layout.width - LeafDimensions.screenPadding * 2);
        }
    };

    // TODO: Clean this entire file up, it's a messr

    return (
        <HStack
            style={{
                flex: 1,
            }}
        >
            {drawerContracted ? undefined : (
                <VStack
                    style={{
                        height: "100%",
                        width: LeafDimensions.drawerWidth,
                        borderRightWidth: LeafDimensions.borderWidth,
                        borderRightColor: LeafColors.divider.getColor(),
                        paddingHorizontal: 16,
                        paddingTop: Insets.top, // Hiding/showing a safe area causes flickering
                        paddingBottom: LeafDimensions.screenPadding + Insets.bottom,
                    }}
                >
                    <HStack
                        spacing={12}
                        style={{ width: "100%", alignItems: "center", paddingTop: 12, paddingBottom: 16 }}
                    >
                        <LeafIconButton
                            icon="book-open-outline"
                            onlyIcon={true}
                            iconColor={LeafColors.textDark}
                            size={LeafIconSize.Large}
                            color={LeafColors.textDark}
                            onPress={toggleDrawer}
                            style={{
                                paddingLeft: LeafDimensions.screenPadding - 16 - 6,
                            }}
                        />

                        <LeafText typography={LeafTypography.headerSection} wide={false} style={{}}>
                            {strings("appName")}
                        </LeafText>
                    </HStack>

                    {leafInterface.sections.map((section) => {
                        return <DrawerItem interfaceSection={section} key={section.id.toString()} />;
                    })}

                    <Spacer />

                    <LeafButton
                        label={strings("button.logout")}
                        color={LeafColors.fillBackgroundLight}
                        typography={LeafTypography.buttonSmall}
                        wide={false}
                        icon="logout"
                        onPress={() => {
                            StateManager.loginStatus.publish(LoginStatus.LoggedOut);
                        }}
                    />
                </VStack>
            )}

            {sidebar == undefined ? undefined : (
                <VStack
                    style={{
                        height: "100%",
                        width: "30%",
                        minWidth: LeafDimensions.minSidebarWidth,
                        maxWidth: LeafDimensions.maxSidebarWidth,
                        borderRightWidth: LeafDimensions.borderWidth,
                        borderRightColor: LeafColors.divider.getColor(),
                        paddingTop: Insets.top, // Hiding/showing a safe area causes flickering
                    }}
                >
                    <VStack style={{ flex: 1, width: "100%" }}>
                        <HStack
                            spacing={12}
                            style={{
                                alignItems: "center",
                                width: "100%",
                                paddingTop: 12,
                                paddingLeft: LeafDimensions.screenPadding,
                                paddingBottom: 10,
                            }}
                        >
                            {!drawerContracted ? undefined : (
                                <LeafIconButton
                                    icon="book-open-outline"
                                    onlyIcon={true}
                                    iconColor={LeafColors.textDark}
                                    size={LeafIconSize.Large}
                                    color={LeafColors.textDark}
                                    onPress={toggleDrawer}
                                    style={{
                                        marginLeft: -6, // To account for icon box
                                    }}
                                />
                            )}

                            <LeafText
                                typography={LeafTypography.headerSection}
                                wide={false}
                                style={{
                                    textAlign: "center",
                                }}
                            >
                                {NavigationSession.inst.sidebarHeader}
                            </LeafText>
                        </HStack>

                        {sidebar}
                    </VStack>
                </VStack>
            )}

            <View
                style={{
                    flex: 1,
                    minWidth: LeafDimensions.minSidebarWidth,
                    paddingTop: 12,
                }}
                onLayout={onLayout}
            >
                <SafeAreaView
                    style={{
                        height: "100%",
                    }}
                >
                    <HStack
                        spacing={12}
                        style={{
                            paddingLeft: LeafDimensions.screenPadding,
                            alignItems: "center",
                        }}
                    >
                        {!(drawerContracted && sidebar == undefined) ? undefined : (
                            <LeafIconButton
                                icon="book-open-outline"
                                onlyIcon={true}
                                iconColor={LeafColors.textDark}
                                size={LeafIconSize.Large}
                                color={LeafColors.textDark}
                                onPress={toggleDrawer}
                                style={{
                                    marginLeft: -6, // To account for icon box
                                }}
                            />
                        )}

                        <LeafText typography={LeafTypography.subscript} wide={false}>
                            {screens
                                .map((screen) => {
                                    return screen.title;
                                })
                                .join(" / ")}
                        </LeafText>
                    </HStack>

                    {screens.length == 0 ? (
                        <EmptyScreen />
                    ) : (
                        <Stack.Navigator>
                            {screens.map((screen, index) => {
                                return (
                                    <Stack.Screen
                                        // Yes, key/name are both id
                                        key={screen.id.toString()}
                                        name={screen.id.toString()}
                                        component={screen.component}
                                        options={({ navigation }) => ({
                                            ...screen.options,
                                            animationEnabled: index > 0 && !PlatformIsWeb,
                                            header: () => (
                                                <LeafHeader
                                                    title={screen.title}
                                                    buttonProps={{
                                                        canGoBack: index > 0,
                                                        navigation: navigation,
                                                    }}
                                                />
                                            ),
                                        })}
                                    />
                                );
                            })}
                        </Stack.Navigator>
                    )}
                </SafeAreaView>
            </View>
        </HStack>
    );
};

export default DrawerNavigator;
