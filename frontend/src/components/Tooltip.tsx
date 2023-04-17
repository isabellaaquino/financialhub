import { useState } from "react";
import "./css/Tooltip.css";

interface Props {
  delay?: any;
  direction?: string;
  content: string;
}

export default function ToolTip(props: Props) {
  const [active, setActive] = useState(false);

  const showTip = () => {
    setActive(true);
  };

  const hideTip = () => {
    setActive(false);
  };

  return (
    <span
      className="material-symbols-rounded text-xs opacity-40 inline-block relative ml-0.5"
      onMouseOver={showTip}
      onMouseOut={hideTip}
    >
      help
      {active && (
        <div
          className={`Tooltip-Tip ${props.direction || "top"}`}
        >
          {props.content}
        </div>
      )}
    </span>
  );
}
