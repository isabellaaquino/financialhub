import { isatty } from "node:tty";
import { useContext, useState } from "react";
import SideNav from "../components/SideNav";
import TopNav from "../components/TopNav";
import { useAuth } from "../hooks/useAuth";
import Home from "./Home";
import SignIn from "./SignIn";

function Root() {
  let { user } = useAuth();
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);

  function handleSideNav(state: boolean) {
    setIsSideNavOpen(state);
  }

  return (
    <div className="Root">
      {/* <SignIn /> */}
      {user ? (
        <>
          <SideNav state={isSideNavOpen} handleState={handleSideNav} />
          <TopNav />
          <Home isSideNavOpen={isSideNavOpen} />
        </>
      ) : (
        <SignIn />
      )}
    </div>
  );
}

export default Root;
