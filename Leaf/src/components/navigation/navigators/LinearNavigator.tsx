import { createStackNavigator } from "@react-navigation/stack";
import LeafScreen from "../LeafScreen";
import { NavigationContainer } from "@react-navigation/native";
import { useEffect, useState } from "react";
import NavigationSession from "../state/NavigationEnvironment";
import NavigationStateManager from "../state/NavigationStateManager";

interface Props {
    screen: LeafScreen;
}

export const LinearNavigator: React.FC<Props> = ({ screen }) => {
    const [screens, setScreens] = useState<LeafScreen[]>([screen]);

    const Stack = createStackNavigator();

    useEffect(() => {
        NavigationSession.inst.setStartingScreen(screen);

        NavigationStateManager.screenStackUpdated.subscribe(() => {
            setScreens([...NavigationSession.inst.screens]);
        });
    }, []);

    useEffect(() => {
        NavigationSession.inst.loadedNavigation();
        NavigationSession.inst.loadedNavigation = () => {};
    }, [screens]);

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {screens.map((screen) => {
                    return (
                        <Stack.Screen
                            key={screen.id.toString()}
                            name={screen.id.toString()}
                            component={screen.component}
                            options={({ navigation }) => ({
                                ...screen.options,
                                header: () => <></>,
                            })}
                        />
                    );
                })}
            </Stack.Navigator>
        </NavigationContainer>
    );
};