import ToolTip from "./Tooltip";

interface Props {
    title: string;
    styling?: string;
    tooltipText?: string;
}

export default function ModalLabel(props: Props) {
    return (
        <>
        <label className={`block uppercase tracking-wide text-gray-700 text-xs font-bold ${props.styling}`}>
            {props.title}
            {props.tooltipText && <ToolTip content={props.tooltipText}/>}
        </label>
        </>
    )
}