import { useState } from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";

interface Props {
  state: boolean;
  handleState: (state: boolean) => void;
}
function SideNav(props: Props) {
  const location = useLocation();

  function handleSideNav() {
    props.handleState(!props.state);
  }

  return (
    <div className="SideNav fixed">
      <nav
        style={{
          width: !props.state ? "56px" : "300px",
          paddingLeft: !props.state ? 0 : 30,
          alignItems: !props.state ? "center" : "start",
        }}
        className={`h-screen bg-blue-800 flex flex-col justify-between items-start py-10`}
      >
        <div
          className={
            "flex flex-col text-white" + !props.state
              ? "items-center w-full"
              : "items-start"
          }
        >
          <p
            className={`${
              !props.state && "hidden"
            } text-blue-300 mt-8 text-xs uppercase`}
          >
            Navigation
          </p>
          <Link
            to="/"
            className={`mt-5 p-3 flex items-center ${
              location.pathname === "/"
                ? "bg-blue-700 text-white w-full"
                : "text-blue-300"
            } ${props.state && "rounded-l-md"}`}
          >
            <span
              className={`material-symbols-rounded text-xl ${
                !props.state && "ml-1"
              }`}
            >
              leaderboard
            </span>
            <p
              style={{ marginLeft: !props.state ? 0 : 15 }}
              className={!props.state ? "hidden" : "inline"}
            >
              Dashboard
            </p>
          </Link>
          <p
            className={`${
              !props.state && "hidden"
            } text-blue-300 mt-8 text-xs uppercase ${
              props.state && "rounded-l-md"
            }`}
          >
            Manage
          </p>
          <Link
            to="/transactions"
            className={`mt-5 p-3 flex items-center ${
              location.pathname === "/transactions"
                ? "bg-blue-700 text-white w-full"
                : "text-blue-300"
            } ${props.state && "rounded-l-md"}`}
          >
            <span
              className={`material-symbols-rounded text-xl ${
                !props.state && "ml-1"
              }`}
            >
              receipt
            </span>
            <p
              style={{ marginLeft: !props.state ? 0 : 15 }}
              className={!props.state ? "hidden" : "inline"}
            >
              Transactions
            </p>
          </Link>
          <Link
            to="/saving-plans"
            className={`mt-4 p-3 flex items-center ${
              location.pathname === "/saving-plans"
                ? "bg-blue-700 text-white w-full"
                : "text-blue-300"
            } ${props.state && "rounded-l-md"}`}
          >
            <span
              className={`material-symbols-rounded text-xl ${
                !props.state && "ml-1"
              }`}
            >
              savings
            </span>
            <p
              style={{ marginLeft: !props.state ? 0 : 15 }}
              className={!props.state ? "hidden" : "inline"}
            >
              Saving Plans
            </p>
          </Link>
        </div>
        <div>
          <a onClick={handleSideNav} className="text-white">
            <span className="material-symbols-rounded text-3xl">
              exit_to_app
            </span>
          </a>
        </div>
      </nav>
    </div>
  );
}

export default SideNav;
