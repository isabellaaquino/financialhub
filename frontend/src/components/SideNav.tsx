import { useState } from "react";

interface Props {
  state: boolean;
  handleState: (state: boolean) => void;
}
function SideNav(props: Props) {
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
              ? "items-center"
              : "items-start"
          }
        >
          <a href="/" className="flex items-center text-white">
            <span className="material-symbols-rounded">home</span>
            <p
              style={{ marginLeft: !props.state ? 0 : 10 }}
              className={!props.state ? "hidden" : "inline"}
            >
              Home
            </p>
          </a>
          <a href="#" className="mt-10 flex items-center text-white">
            <span className="material-symbols-rounded">monitoring</span>
            <p
              style={{ marginLeft: !props.state ? 0 : 10 }}
              className={!props.state ? "hidden" : "inline"}
            >
              Dashboard
            </p>
          </a>
          <a href="#" className="mt-10 flex items-center text-white">
            <span className="material-symbols-rounded">leaderboard</span>
            <p
              style={{ marginLeft: !props.state ? 0 : 10 }}
              className={!props.state ? "hidden" : "inline"}
            >
              Wallet
            </p>
          </a>
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
