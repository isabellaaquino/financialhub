import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface Props {
  to: string;
  iconName?: string;
  text: string;
}

function ItemNav(props: Props) {
  const { isSideNavOpen } = useAuth();
  const location = useLocation();

  return (
    <Link
      to={props.to}
      className={`lg:mt-3 p-3 flex items-center ${
        location.pathname === props.to
          ? "bg-green-500 text-white w-full"
          : "text-gray-400 hover:bg-black-300"
      } ${isSideNavOpen && "rounded-l-md"}`}
    >
      <span
        className={`material-symbols-rounded text-xl ${
          !isSideNavOpen && "lg:ml-2"
        }`}
      >
        {props.iconName}
      </span>
      <p className={isSideNavOpen ? "inline ml-4" : "hidden ml-0"}>
        {props.text}
      </p>
    </Link>
  );
}

export default ItemNav;
