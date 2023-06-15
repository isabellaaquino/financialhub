import { useState } from "react";
import AddTransaction from "./AddTransaction";

interface Props {
  text: string;
  iconName: string;
  isAddTransaction: boolean;
  showAlert(message: string, type: string): void;
}
function QuickAccessCard(props: Props) {
  const [isOpen, setIsOpen] = useState(false);

  function handleTransactionModal(state: boolean) {
    setIsOpen(state);
  }

  return (
    <div>
      <div
        onClick={() => props.isAddTransaction ? handleTransactionModal(true) : undefined}
        className="cursor-pointer text-center p-4 bg-black-400 rounded-md w-40 h-44 flex justify-center flex-col items-center hover:border-2 border-white-500"
      >
        <span className="material-symbols-rounded text-white bg-green-500 rounded-full p-2">
          {props.iconName}
        </span>
        <h3 className="mt-2 whitespace-normal text-white">{props.text}</h3>
      </div>

      <AddTransaction
        handleAlert={props.showAlert}
        isOpen={isOpen}
        handleState={handleTransactionModal}
      />
    </div>
  );
}

export default QuickAccessCard;
