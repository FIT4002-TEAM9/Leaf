import React from "react"
import { NurseUI } from "./DemoAccountUI"

/**
 * Our screen object
 */
export interface LeafScreen {
    name: string,
    component: React.FC,
    options?: object
};

/**
 * A sidebar item, this will be displayed in the sidebar on tablet
 * Pass props must update the props you require for the next screen
 */
export interface LeafSideBarItem {
    component: React.FC,
    passProps: () => void,
    searchableString?: string,
};

/**
 * Our stack object
 */
export interface LeafStack {
    stackName: string,
    initialRouteName: string,
    sideBarItemList: LeafSideBarItem[],
    sideBarSearchable: boolean,
    screens: LeafScreen[],
    icon: string,
    focusedIcon: string,
    options?: object
};

/**
 * The UI element for an account
 */
export interface LeafAccountUI {
    name: string,
    stacks: LeafStack[]
};

/**
 * Add Account UI to here once complete
 */
const LeafAppUserInterfaces = {
    nurse: NurseUI
};

// We freeze this as we do not want anyone modifying the screens during run time
Object.freeze(LeafAppUserInterfaces);

export { LeafAppUserInterfaces } 