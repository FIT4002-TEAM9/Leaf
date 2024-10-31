import { strings } from "../../localisation/Strings";
import LeafInterface from "../navigation/LeafInterface";
import LeafInterfaceSection from "../navigation/LeafInterfaceSection";
import NavigationSession from "../navigation/state/NavigationEnvironment";
import AllNursesScreen from "../screens/AllNursesScreen";
import AllLeadersScreen from "../screens/AllLeadersScreen";
import NewAccountScreen from "../screens/NewAccountScreen";
import ExportPatientScreen from "../screens/ExportPatientScreen";
import FileHistoryScreen from "../screens/FileHistoryScreen";

export const AdminInterface = new LeafInterface()
    .addSection(
        new LeafInterfaceSection(
            strings("tabBar.admin.nurses"),
            () => {
                // Tab bar
                NavigationSession.inst.navigateTo(AllNursesScreen, undefined, strings("header.admin.viewNurses"));
                NavigationSession.inst.setSidebarComponent(undefined, undefined);
            },
            () => {
                // Drawer
                NavigationSession.inst.clearScreens();
                NavigationSession.inst.setSidebarComponent(<AllNursesScreen />, strings("header.admin.viewNurses"));
            },
            "hospital-box",
            "hospital-box-outline",
        ),
    )
    .addSection(
        new LeafInterfaceSection(
            strings("tabBar.admin.leaders"),
            () => {
                // Tab bar
                NavigationSession.inst.navigateTo(AllLeadersScreen, undefined, strings("header.admin.viewLeaders"));
                NavigationSession.inst.setSidebarComponent(undefined, undefined);
            },
            () => {
                // Drawer
                NavigationSession.inst.clearScreens();
                NavigationSession.inst.setSidebarComponent(<AllLeadersScreen />, strings("header.admin.viewLeaders"));
            },
            "flag",
            "flag-outline",
        ),
    )
    .addSection(
        new LeafInterfaceSection(
            strings("tabBar.admin.new"),
            () => {
                // Tab bar
                NavigationSession.inst.navigateTo(NewAccountScreen, undefined, strings("header.admin.newAccount"));
                NavigationSession.inst.setSidebarComponent(undefined, undefined);
            },
            () => {
                // Drawer
                NavigationSession.inst.navigateTo(NewAccountScreen, undefined, strings("header.admin.newAccount"));
                NavigationSession.inst.setSidebarComponent(undefined, undefined);
            },
            "account-plus",
            "account-plus-outline",
        ),
    )
    .addSection(
        new LeafInterfaceSection(
            strings("tabBar.admin.export"),
            () => {
                // Tab bar
                NavigationSession.inst.navigateTo(
                    ExportPatientScreen,
                    undefined,
                    strings("header.admin.exportPatient"),
                );
                NavigationSession.inst.setSidebarComponent(undefined, undefined);
            },
            () => {
                // Drawer
                NavigationSession.inst.navigateTo(
                    ExportPatientScreen,
                    undefined,
                    strings("header.admin.exportPatient"),
                );
                NavigationSession.inst.setSidebarComponent(undefined, undefined);
            },
            "file-export",
            "file-export-outline",
        ),
    )
    .addSection(
            new LeafInterfaceSection(
                strings("tabBar.admin.fileHistory"), // Localized title for the section
                () => {
                    // Tab bar
                    NavigationSession.inst.navigateTo(
                        FileHistoryScreen, // Navigate to fileHistoryScreen
                        undefined,
                        strings("header.admin.fileHistory") // Localized header title
                    );
                    NavigationSession.inst.setSidebarComponent(undefined, undefined);
                },
                () => {
                    // Drawer
                    NavigationSession.inst.navigateTo(
                        FileHistoryScreen, // Navigate to fileHistoryScreen
                        undefined,
                        strings("header.admin.fileHistory") // Localized header title
                    );
                    NavigationSession.inst.setSidebarComponent(undefined, undefined); // Clear sidebar component
                },
                "history", // Icon for the selected state (you can use any suitable icon)
                "history" // Icon for the unselected state
            )
        );
