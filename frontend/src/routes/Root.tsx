import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import Home from "./Home";
import SignIn from "./SignIn";

function Root() {
  const { isAuthenticated } = useAuth();
  return <div className="Root">{isAuthenticated ? <Home /> : <SignIn />}</div>;
}

export default Root;
