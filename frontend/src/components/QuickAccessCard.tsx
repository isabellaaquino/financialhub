import { useState } from "react";
import AddTransaction from "./AddTransaction";

interface Props {
  text: string;
  iconName: string;
  isAddTransaction: boolean;
}
function QuickAccessCard(props: Props) {
  const [isAddTransaction, setAddTransactionIsOpen] = useState(false);

  function openAddTransaction() {
    setAddTransactionIsOpen(true);
  }

  return (
    <div>
      <div
        onClick={props.isAddTransaction ? openAddTransaction : undefined}
        className="cursor-pointer text-center p-4 bg-black-400 rounded-md w-40 h-44 flex justify-center flex-col items-center hover:border-2 border-white-500"
      >
        <span className="material-symbols-rounded text-white bg-green-500 rounded-full p-2">
          {props.iconName}
        </span>
        <h3 className="mt-2 whitespace-normal text-white">{props.text}</h3>
      </div>

      <AddTransaction
        handleAlert={openAddTransaction}
        isOpen={isAddTransaction}
        handleState={setAddTransactionIsOpen}
      />
    </div>
  );
}

export default QuickAccessCard;
