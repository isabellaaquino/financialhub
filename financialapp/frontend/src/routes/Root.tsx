import { useState } from "react";
import Home from "./Home";
import Login from "./Login";

function Root() {
  const [authContext, setAuthContext] = useState({
    isAuthenticated: false,
  });
  return (
    <div className="Root">
      {authContext.isAuthenticated ? <Home /> : <Login />}
    </div>
  );
}

export default Root;
