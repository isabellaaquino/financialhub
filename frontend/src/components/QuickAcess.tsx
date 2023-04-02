import { useState } from "react";
import AddTransaction from "./AddTransaction";

function QuickAccess() {
  const [isAddTransaction, setAddTransactionIsOpen] = useState(false);

  function openAddTransaction() {
    setAddTransactionIsOpen(true);
  }
  
  return (
    <div className="QuickCards flex flex-row mt-10 overflow-hidden w-full text-md">
      <div className="border h-20 flex flex-row justify-between p-3 mr-3 items-center rounded-md shadow-md">
        <h3 className="text-left mr-10">My Wallet</h3>
        <span className="material-symbols-rounded">wallet</span>
      </div>
      <div className="border w-48 h-20 flex flex-row justify-between p-3 mr-3 items-center rounded-md shadow-md">
        <h3 className="text-left mr-10">My Dashboard</h3>
        <span className="material-symbols-rounded">wallet</span>
      </div>

      <AddTransaction
        isOpen={isAddTransaction}
        handleState={setAddTransactionIsOpen}
      />

      <div onClick={openAddTransaction} className="border w-48 h-20 flex flex-row justify-between p-3 mr-3 items-center rounded-md shadow-md cursor-pointer">
        <h3 className="text-left mr-10">Add Transaction</h3>
        <span className="material-symbols-rounded">wallet</span>
      </div>
    </div>
  );
}

export default QuickAccess;
