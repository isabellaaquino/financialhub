import { isatty } from "node:tty";
import { useContext, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import Home from "./Home";
import SignIn from "./SignIn";

function Root() {
  let { user } = useAuth();

  return <div className="Root">{user ? <Home /> : <SignIn />}</div>;
}

export default Root;
