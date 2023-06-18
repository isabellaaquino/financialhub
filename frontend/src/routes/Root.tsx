import SideNav from "../components/SideNav";
import TopNav from "../components/TopNav";
import { useAuth } from "../hooks/useAuth";
import Home from "./Home";
import SignIn from "./SignIn";

function Root() {
  let { user } = useAuth();

  return (
    <div className="Root bg-black-500">
      {user ? (
        <>
          <SideNav />
          <TopNav />
          <Home />
        </>
      ) : (
        <SignIn />
      )}
    </div>
  );
}

export default Root;
