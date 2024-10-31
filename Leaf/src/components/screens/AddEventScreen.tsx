import { NavigationProp, ParamListBase } from "@react-navigation/native";
import React, { useState } from "react";
import { View } from "react-native";
import { strings } from "../../localisation/Strings";
import { PatientEventCategories, PatientEventCategory } from "../../model/patient/PatientEventCategory";
import LeafButton from "../base/LeafButton/LeafButton";
import LeafSelectionInput from "../base/LeafListSelection/LeafSelectionInput";
import LeafSelectionItem from "../base/LeafListSelection/LeafSelectionItem";
import LeafMultilineTextInput from "../base/LeafMultilineTextInput/LeafMultilineTextInput";
import LeafTextInput from "../base/LeafTextInput/LeafTextInput";
import LeafTimeInput from "../base/LeafTimeInput/LeafTimeInput";
import VStack from "../containers/VStack";
import NavigationSession from "../navigation/state/NavigationEnvironment";
import LeafColors from "../styling/LeafColors";
import LeafDimensions from "../styling/LeafDimensions";
import ValidateUtil from "../../utils/ValidateUtil";
import Session from "../../model/session/Session";
import PatientEvent from "../../model/patient/PatientEvent";
import { useNotificationSession } from "../base/LeafDropNotification/NotificationSession";
import EventCategoryContainer from "../custom/event_categories/EventCategoryContainer";

interface Props {
    navigation?: NavigationProp<ParamListBase>;
}

const AddEventScreen: React.FC<Props> = ({ navigation }) => {
    const { showErrorNotification, showSuccessNotification } = useNotificationSession();
    const [title, setTitle] = useState<string | undefined>();
    const [triggerTime, setTriggerTime] = useState<Date | undefined>();
    const [description, setDescription] = useState<string | undefined>();
    const [category, setCategory] = useState<PatientEventCategory | undefined>();
    const [eventData, setEventData] = useState<string | undefined>();

    const allIsValid = (): boolean => {
        return (
            ValidateUtil.stringIsValid(title) &&
            ValidateUtil.valueIsDefined(triggerTime) &&
            ValidateUtil.stringIsValid(description) &&
            ValidateUtil.valueIsDefined(category) &&
            ValidateUtil.stringIsValid(eventData)
        );
    };

    const onSubmit = async () => {
        if (allIsValid()) {
            // We force-unwrap everything because we assume everything is validated already
            // If allIsValid() is every removed, TAKE OUT THE FORCE UNWRAPS
            // Otherwise this WILL cause errors
            const event = PatientEvent.new(triggerTime!, title!, description!, category!, eventData!);
            const successful = await Session.inst.submitPatientEvent(event);
            if (successful) {
                showSuccessNotification(strings("feedback.eventCreated"));
                NavigationSession.inst.navigateBack(navigation);
            }
        } else {
            showErrorNotification(strings("feedback.invalidInputs"));
        }
    };

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: LeafColors.screenBackgroundLight.getColor(),
                padding: LeafDimensions.screenPadding,
            }}
        >
            <VStack
                spacing={LeafDimensions.screenSpacing}
                style={{
                    flex: 1,
                }}
            >
                <LeafTextInput label={strings("inputLabel.title")} onTextChange={(text: string) => setTitle(text)} />

                <LeafTimeInput
                    label={strings("inputLabel.triggerTime")}
                    onChange={(date?: Date) => setTriggerTime(date)}
                />

                <LeafMultilineTextInput
                    label={strings("inputLabel.description")}
                    onTextChange={(text: string) => setDescription(text)}
                />

                <LeafSelectionInput
                    navigation={navigation}
                    title={strings("inputLabel.category")}
                    items={[
                        new LeafSelectionItem<PatientEventCategory>(
                            PatientEventCategories.DRUG_EXPOSURE,
                            strings("label.category"),
                            new PatientEventCategory(PatientEventCategories.DRUG_EXPOSURE),
                        ),
                        new LeafSelectionItem<PatientEventCategory>(
                            PatientEventCategories.VISIT_OCCURRENCE,
                            strings("label.category"),
                            new PatientEventCategory(PatientEventCategories.VISIT_OCCURRENCE),
                        ),
                        new LeafSelectionItem<PatientEventCategory>(
                            PatientEventCategories.CONDITION_OCCURRENCE,
                            strings("label.category"),
                            new PatientEventCategory(PatientEventCategories.CONDITION_OCCURRENCE),
                        ),
                        new LeafSelectionItem<PatientEventCategory>(
                            PatientEventCategories.PROCEDURE_OCCURRENCE,
                            strings("label.category"),
                            new PatientEventCategory(PatientEventCategories.PROCEDURE_OCCURRENCE),
                        ),
                        new LeafSelectionItem<PatientEventCategory>(
                            PatientEventCategories.DEVICE_EXPOSURE,
                            strings("label.category"),
                            new PatientEventCategory(PatientEventCategories.DEVICE_EXPOSURE),
                        ),
                        new LeafSelectionItem<PatientEventCategory>(
                            PatientEventCategories.MEASUREMENT,
                            strings("label.category"),
                            new PatientEventCategory(PatientEventCategories.MEASUREMENT),
                        ),
                        new LeafSelectionItem<PatientEventCategory>(
                            PatientEventCategories.OBSERVATION,
                            strings("label.category"),
                            new PatientEventCategory(PatientEventCategories.OBSERVATION),
                        ),
                        new LeafSelectionItem<PatientEventCategory>(
                            PatientEventCategories.EPISODE,
                            strings("label.category"),
                            new PatientEventCategory(PatientEventCategories.EPISODE),
                        ),
                        new LeafSelectionItem<PatientEventCategory>(
                            PatientEventCategories.NOTE,
                            strings("label.category"),
                            new PatientEventCategory(PatientEventCategories.NOTE),
                        ),
                    ]}
                    selected={
                        category != undefined
                            ? new LeafSelectionItem<PatientEventCategory>(
                                  category.toString(),
                                  strings("label.category"),
                                  category,
                              )
                            : undefined
                    }
                    onSelection={(item: LeafSelectionItem<unknown> | undefined) => {
                        if (!item) {
                            setCategory(undefined);
                        } else {
                            setCategory((item as LeafSelectionItem<PatientEventCategory>).value);
                        }
                    }}
                />

                {category && <EventCategoryContainer category={category.id} onUpdate={(value) => setEventData(JSON.stringify(value))} />}
            </VStack>

            <LeafButton label={strings("button.submit")} onPress={onSubmit} />
        </View>
    );
};

export default AddEventScreen;
