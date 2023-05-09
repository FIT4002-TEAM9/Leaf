import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createStackNavigator } from "@react-navigation/stack";
import { LeafScreen, LeafSideBarItem, LeafStack } from "./Types";
import CustomLeafHeader from "./CustomHeader";

/**
 * Creates a leaf screen
 * @param name the name of the screen, this will displayed in the header
 * @param component the actual screen to render
 * @param options the options to add to the screen, these will be provided to the <Stack.Screen> component (https://reactnavigation.org/docs/stack-navigator)
 * @returns a {@link LeafScreen} with your parameters
 */
export function createLeafScreen(name: string, component: React.FC, options?: object): LeafScreen {
    return { name, component, options }
}

/**
 * Creates a leaf stack
 * @param stackName the name of the stack, this will be the name seen on the tab bar
 * @param initialRouteName the initial screen
 * @param screens the screens in the stack, the first element in the array will be taken as the first screen
 * @param icon the icon for the tab bar to show
 * @param focusedIcon the icon for the tab bar to show when the stack is selected
 * @param options the stack options, provided to the stack (https://reactnavigation.org/docs/stack-navigator)
 * @param sideBarItemList the side bar items, if your first screen is a list of items that should be rendered as a sidebar on tablet (see navigation on github) then you will need to provide this param
 * @returns a {@link LeafStack}
 */
export function createLeafStack(stackName: string, initialRouteName: string, screens: LeafScreen[], icon: string, focusedIcon: string, options?: object, sideBarItemList: LeafSideBarItem[]= []): LeafStack {
    return { stackName, initialRouteName, sideBarItemList, screens, icon, focusedIcon, options };
}

/**
 * Adds a screen to a stack
 * @param stack the stack you want to add to
 * @param screen the screen you want to add
 * @returns a {@link LeafStack} with the added screen
 */
export function AddScreenToStack(stack: LeafStack, screen: LeafScreen): LeafStack {
    stack.screens.push(screen);
    return stack;
}

/**
 * Render a react native native stack with the screens you include in the leafstack
 * @param leafStack the stack you want to render
 * @returns a React Native Native Stack
 */
function renderNativeStack(leafStack: LeafStack) {
    
    const Stack = createStackNavigator();

    // these options must apply to all screens in our application
    const globalOptions = {

    }

    return (
        <Stack.Navigator>
            {
                leafStack.screens.map((s, index) => {
                    return (
                            <Stack.Screen 
                                key={s.name}
                                name={s.name}
                                component={s.component}
                                options={({ navigation }) => ({
                                    ...s.options,
                                    ...globalOptions,
                                    header: () => (
                                        <CustomLeafHeader
                                            title={s.name}
                                            buttonProps={
                                                {
                                                    canGoBack: index > 0,
                                                    navigation: navigation,
                                                }
                                            }
                                        />
                                    )
                                })}
                            />
                        )
                    })
                }
        </Stack.Navigator>
    )
}

/**
 * This wrapper takes our stack object and returns a react component that does not take in any props, then uses the leafStack object to render a native stack
 * This is required as the navigation components (tabbar, drawer, etc) require components, not already rendered JSX elements
 * @param leafStack the stack to you want to convert to a component
 * @returns A react stack component
 */
export const StackWrapper = (leafStack: LeafStack): React.FC => {
    
    const NativeStack: React.FC = () => {
        return renderNativeStack(leafStack);
    };
    
    return NativeStack;
}