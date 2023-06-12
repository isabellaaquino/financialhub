import { Link } from "react-router-dom";
import ItemNav from "./ItemNav";
import LabelNav from "./LabelNav";
import Title from "./Title";

interface Props {
  state: boolean;
  handleState: (state: boolean) => void;
}

function SideNav(props: Props) {
  function handleSideNav() {
    props.handleState(!props.state);
  }

  return (
    <div className="SideNav fixed z-20">
      <nav
        style={{
          width: !props.state ? "56px" : "250px",
          paddingLeft: !props.state ? 0 : 30,
          alignItems: !props.state ? "center" : "start",
        }}
        className={`h-screen bg-black-400 justify-between flex flex-col items-start py-10`}
      >
        <div
          className={
            "flex flex-col text-white" + !props.state
              ? "items-center w-full"
              : "items-start"
          }
        >
          <Link to="/" className={`text-white font-medium font-logo text-2xl ${!props.state && "text-center"}`}>
            {props.state ? (
              <h1>
                Financial<strong className="text-green-500">hub</strong>
              </h1>
            ) : (
              <h1>
                F<strong className="text-green-500">.</strong>
              </h1>
            )}
          </Link>
          <div className="mt-14">
            <LabelNav sideNavState={props.state} text="Navigation" />
            <ItemNav
              to="/"
              text="Dashboard"
              sideNavState={props.state}
              handleState={props.handleState}
              iconName="leaderboard"
            />

            <LabelNav sideNavState={props.state} text="Manage" />
            <ItemNav
              to="/transactions"
              text="Transactions"
              sideNavState={props.state}
              handleState={props.handleState}
              iconName="receipt"
            />
            <ItemNav
              to="/saving-plans"
              text="Saving Plans"
              sideNavState={props.state}
              handleState={props.handleState}
              iconName="savings"
            />
          </div>
        </div>
        <div>
          <a onClick={handleSideNav} className="text-white cursor-pointer">
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
