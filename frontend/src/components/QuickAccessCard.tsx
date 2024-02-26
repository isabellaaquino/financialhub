import { ReactElement, useState } from "react";
import AddTransaction from "./AddTransaction";
import LabelManager from "./LabelManager";
import { CustomLabel } from "../models/CustomLabel";

interface Props {
  text: string;
  iconName: string;
  action: string;
  showAlert(message: string, type: string): void;
  userLabels?: CustomLabel[];
}
function QuickAccessCard(props: Props) {
  const [isOpen, setIsOpen] = useState(false);

  function handleModal(state: boolean) {
    setIsOpen(state);
  }

  return (
    <div>
      <div
        onClick={() => handleModal(true)}
        className="cursor-pointer text-center p-4 bg-black-400 rounded-md w-40 h-44 flex justify-center flex-col items-center hover:border-2 border-white-500"
      >
        <span className="material-symbols-rounded text-white bg-green-500 rounded-full p-2">
          {props.iconName}
        </span>
        <h3 className="mt-2 whitespace-normal text-white">{props.text}</h3>
      </div>

      {props.action === "transaction" && (
        <AddTransaction
          handleAlert={props.showAlert}
          isOpen={isOpen}
          handleState={handleModal}
          userLabels={props.userLabels}
        />
      )}

      {props.action === "label" && (
        <LabelManager
          handleAlert={props.showAlert}
          isOpen={isOpen}
          handleState={handleModal}
        />
      )}
    </div>
  );
}

export default QuickAccessCard;
