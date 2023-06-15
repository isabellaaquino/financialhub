import { useState } from "react";
import AddTransaction from "./AddTransaction";
import QuickAccessCard from "./QuickAccessCard";
import Title from "./Title";

interface Props {
  showAlert(message: string, type: string): void;
}

function QuickAccess(props: Props) {
  return (
    <div>
      <Title text="Quick Access" />
      <div className="grid grid-flow-col justify-start gap-2">
        <QuickAccessCard
          text="New transaction"
          iconName="wallet"
          isAddTransaction={true}
          showAlert={props.showAlert}
        />
        <QuickAccessCard
          text="Import file"
          iconName="upload_file"
          isAddTransaction={false}
          showAlert={props.showAlert}
        />
      </div>
    </div>
  );
}

export default QuickAccess;
