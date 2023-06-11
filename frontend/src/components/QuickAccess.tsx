import { useState } from "react";
import AddTransaction from "./AddTransaction";
import QuickAccessCard from "./QuickAccessCard";
import Title from "./Title";

function QuickAccess() {
  const [isAddTransaction, setAddTransactionIsOpen] = useState(false);

  function openAddTransaction() {
    setAddTransactionIsOpen(true);
  }

  return (
    <div>
      <Title text="Quick Access" />
      <div className="grid grid-flow-col justify-start gap-2">
        <QuickAccessCard
          text="New transaction"
          iconName="wallet"
          isAddTransaction={true}
        />
        <QuickAccessCard
          text="Import file"
          iconName="upload_file"
          isAddTransaction={true}
        />
      </div>
    </div>
  );
}

export default QuickAccess;
