import { Link } from "react-router-dom";
import ItemNav from "./ItemNav";
import LabelNav from "./LabelNav";
import { useAuth } from "../hooks/useAuth";

function SideNav() {
  const { isSideNavOpen, setIsSideNavOpen } = useAuth();

  function handleSideNav() {
    setIsSideNavOpen(!isSideNavOpen);
  }

  return (
    <div className="SideNav fixed bottom-0 lg:bottom-auto z-30">
      <nav
        className={`${
          !isSideNavOpen
            ? "lg:w-16 pl-0 items-center"
            : "lg:w-64 pl-8 items-start"
        } w-screen lg:h-screen h-14 bottom-0 bg-black-400 justify-between flex flex-row lg:flex-col items-start py-6`}
      >
        <div
          className={`flex flex-row w-full lg:flex-col text-white" ${
            !isSideNavOpen ? "items-center w-full" : "items-start"
          }
              `}
        >
          <Link
            to="/"
            className={`text-white font-medium font-logo text-2xl mx-5 lg:mx-0 ${
              !isSideNavOpen && "text-center"
            }`}
          >
            {isSideNavOpen ? (
              <h1>
                Financial<strong className="text-green-500">hub</strong>
              </h1>
            ) : (
              <h1>
                F<strong className="text-green-500">.</strong>
              </h1>
            )}
          </Link>
          <div className="flex flex-row w-full lg:flex-col gap-5">
            <div className="lg:mt-10 flex flex-row lg:flex-col gap-3 lg:gap-0">
              <LabelNav text="Navigation" />
              <ItemNav to="/" text="Dashboard" iconName="leaderboard" />

              <LabelNav text="Manage" />
              <ItemNav
                to="/transactions"
                text="Transactions"
                iconName="receipt"
              />
              <ItemNav
                to="/saving-plans"
                text="Saving Plans"
                iconName="savings"
              />
            </div>
          </div>
        </div>
        <div className="hidden lg:block mt-2 px-8 lg:px-0 lg:mt-0">
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
