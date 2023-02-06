import { useState } from "react";
import Home from "./Home";
import SignIn from "./SignIn";

function Root() {
  const [authContext, setAuthContext] = useState({
    isAuthenticated: true,
  });
  return (
    <div className="Root">
      {authContext.isAuthenticated ? <Home /> : <SignIn />}
    </div>
  );
}

export default Root;