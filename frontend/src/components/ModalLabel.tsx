import ToolTip from "./Tooltip";

interface Props {
  title: string;
  styling?: string;
  tooltipText?: string;
}

export default function ModalLabel(props: Props) {
  return (
    <>
      <label
        className={`flex flex-row items-center gap-2 tracking-wide text-white text-sm font-normal ${props.styling}`}
      >
        <p>{props.title}</p>
        {props.tooltipText && <ToolTip content={props.tooltipText} />}
      </label>
    </>
  );
}
