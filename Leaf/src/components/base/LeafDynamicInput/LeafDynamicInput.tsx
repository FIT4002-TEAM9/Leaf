import React, {useEffect, useState} from "react";
import VStack from "../../containers/VStack";
import LeafTextInput from "../LeafTextInput/LeafTextInput";
import LeafDateInput from "../LeafDateInput/LeafDateInput";
import LeafNumberInput from "../LeafNumberInput/LeafNumberInput";

interface Props {
  label: string;
  type: string;
  onUpdate: (value: any) => void;
}

const LeafDynamicInput: React.FC<Props> = ({
  label,
  type,
  onUpdate
}) => {
  const [value, setValue] = useState();

  function updateValue(input: any) {
    setValue(input);
    onUpdate(input);
  }

  return (
      <VStack spacing={2}>
        {
          {
            'string': <LeafTextInput label={label} onTextChange={(text: string) => updateValue(text)} />,
            'number': <LeafNumberInput label={label} onChange={(number: number) => updateValue(number)} />,
            'date': <LeafDateInput label={label} onChange={(date: Date | undefined) => updateValue(date)} />
          }[type]
        }
      </VStack>
  );
};

export default LeafDynamicInput;
