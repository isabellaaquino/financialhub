import { CustomLabel } from "../models/CustomLabel";
import QuickAccessCard from "./QuickAccessCard";
import Title from "./Title";

interface Props {
  showAlert(message: string, type: string): void;
  userLabels?: CustomLabel[];
}

function QuickAccess(props: Props) {
  return (
    <div>
      <Title text="Quick Access" />
      <div className="grid grid-flow-col justify-start gap-2">
        <QuickAccessCard
          text="New transaction"
          iconName="payments"
          action="transaction"
          showAlert={props.showAlert}
          userLabels={props.userLabels}
        />
        <QuickAccessCard
          text="Manage labels"
          iconName="new_label"
          action="label"
          showAlert={props.showAlert}
        />
        <QuickAccessCard
          text="Import file"
          iconName="upload_file"
          action="upload_file"
          showAlert={props.showAlert}
        />
      </div>
    </div>
  );
}

export default QuickAccess;
