import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import Modal from 'react-native-modal'; // Modal component for displaying the popup
import LeafButton from '../base/LeafButton/LeafButton'; // Custom button component
import {LeafButtonType} from '../base/LeafButton/LeafButtonType'; // Enum for button types
import LeafTypography from '../styling/LeafTypography'; // Typography styles
import LeafColors from '../styling/LeafColors'; // Color styles
import LeafIcon from "../base/LeafIcon/LeafIcon"; // Custom icon component
import leafColors from "../styling/LeafColors"; // Importing colors again (duplicate)
import LeafTextInput from "../base/LeafTextInput/LeafTextInput"; // Custom text input component
import LeafPasswordInputShort from "../base/LeafPasswordInputShort/LeafPasswordInputShort"; // Custom password input component
import LeafText from "../base/LeafText/LeafText"; // Custom text component
import VGap from "../containers/layout/VGap"; // Vertical gap component for spacing
import LeafDimensions from "../styling/LeafDimensions"; // Dimension styles
import {strings} from "../../localisation/Strings"; // Localization strings

// Define the props interface for the ExportPopup component
interface ExportPopupProps {
    isVisible: boolean; // Determines if the modal is visible
    onClose: () => void; // Function to handle closing the modal
    onExport: (title: string, password: string) => void; // Function to handle exporting with title and password
}

// ExportPopup functional component
const ExportPopup: React.FC<ExportPopupProps> = ({isVisible, onClose, onExport}) => {
    const [title, setTitle] = useState(''); // State for the report title input
    const [password, setPassword] = useState(''); // State for the password input

    // Effect hook to clear inputs when the modal is closed
    useEffect(() => {
        if (!isVisible) {
            setTitle('');
            setPassword('');
        }
    }, [isVisible]);

    // Function to handle the export action
    const handleExport = () => {
        onExport(title, password); // Call the onExport function with title and password
        onClose(); // Close the modal
    };

    return (
        <Modal isVisible={isVisible} onBackdropPress={onClose}>
            <View style={styles.modalContent}>
                <View style={styles.header}>
                    <LeafText typography={LeafTypography.title2} style={{textAlign: "left"}}>
                        {strings("inputLabel.reportDetails")}
                    </LeafText>
                    <LeafIcon
                        icon="close"
                        color={leafColors.textBlack}
                        size={24}
                        onPress={onClose} // Close icon to dismiss the modal
                    />
                </View>

                {/* Text input for the report title */}
                <LeafTextInput
                    label="Report Title"
                    textColor={LeafColors.textDark}
                    color={LeafColors.textBackgroundDark}
                    onTextChange={setTitle} // Update title state on change
                    valid={!!title} // Mark input as valid if title is not empty
                />
                <VGap size={LeafDimensions.textInputSpacing} />

                {/* Password input field */}
                <LeafPasswordInputShort
                    label="Password"
                    textColor={LeafColors.textDark}
                    color={LeafColors.textBackgroundDark}
                    onTextChange={setPassword} // Update password state on change
                    valid={!!password} // Mark input as valid if password is not empty
                />
                <VGap size={LeafDimensions.textInputSpacing} />

                {/* Button to trigger export action */}
                <LeafButton
                    label="Export"
                    icon="file-export"
                    typography={LeafTypography.button}
                    type={LeafButtonType.Filled}
                    color={LeafColors.accent}
                    onPress={handleExport} // Call export handler on press
                    disabled={!title || !password} // Disable button if title or password is empty
                />
            </View>
        </Modal>
    );
};

// Styles for the modal and its contents
const styles = StyleSheet.create({
    header: {
        alignItems: 'center', // Center items vertically
        flexDirection: 'row', // Arrange items in a row
        justifyContent: 'space-between', // Space out items in the header
        marginBottom: 20, // Add bottom margin
    },

    // eslint-disable-next-line react-native/no-color-literals
    modalContent: {
        alignSelf: 'center', // Center the modal on the screen
        backgroundColor: '#ffffff', // White background for the modal
        borderRadius: 10, // Rounded corners
        padding: 20, // Padding around the content
        width: '50%', // Set the width to 50% of the screen
    },
});

export default ExportPopup;