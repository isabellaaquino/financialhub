import { useLocation } from "react-router";
import { Link } from "react-router-dom";

interface Props {
  to: string;
  iconName?: string;
  text: string;
  sideNavState: boolean;
  handleState: (state: boolean) => void;
}

function ItemNav(props: Props) {
  const location = useLocation();

  return (
    <Link
      to={props.to}
      className={`mt-5 p-3 flex items-center ${
        location.pathname === props.to
          ? "bg-green-500 text-white w-full"
          : "text-gray-400"
      } ${props.sideNavState && "rounded-l-md"}`}
    >
      <span
        className={`material-symbols-rounded text-xl ${
          !props.sideNavState && "ml-1"
        }`}
      >
        {props.iconName}
      </span>
      <p
        style={{ marginLeft: !props.sideNavState ? 0 : 15 }}
        className={!props.sideNavState ? "hidden" : "inline"}
      >
        {props.text}
      </p>
    </Link>
  );
}

export default ItemNav;
