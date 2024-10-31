import FormHeader from "../FormHeader";
import { PatientEventCategories } from "../../../model/patient/PatientEventCategory";
import VStack from "../../containers/VStack";
import LeafDimensions from "../../styling/LeafDimensions";
import { EventCategoryFields } from "./EventCategoryFields";
import LeafDynamicInput from "../../base/LeafDynamicInput/LeafDynamicInput";
import React, { useEffect, useState } from "react";

interface Props {
  category: PatientEventCategories;
  onUpdate: (value: any) => void;
}

const EventCategoryContainer: React.FC<Props> = ({category, onUpdate}) => {
  const [inputValues, setInputValues] = useState<{ [key: string]: any }>({});

  function toCamelCase(input: string): string {
    return input.replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => {
      return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
    }).replace(/\s+/g, '');
  }

  const updateInputValues = (label: string, value: any) => {
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [toCamelCase(label)]: value,
    }));
  };

  useEffect(() => {
    onUpdate(inputValues);
  }, [inputValues]);

  return (
    <>
      <FormHeader title={category.toString()} />
      <VStack
        spacing={LeafDimensions.screenSpacing}
        style={{
          flex: 1,
        }}
      >
        {Object.keys(EventCategoryFields[category]).map((fieldName) => {
          return (
            <LeafDynamicInput
                key={fieldName}
                label={fieldName}
                type={EventCategoryFields[category][fieldName]}
                onUpdate={(value) => updateInputValues(fieldName, value)}
            />
          )
        })}
      </VStack>
    </>
  )
}

export default EventCategoryContainer;
