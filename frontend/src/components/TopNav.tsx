import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import UserDropdown from "./UserDropdown";

function TopNav() {
  return (
    <div className="TopNav z-40">
      <nav className="flex justify-end w-screen pt-4 pb-3 px-3">
        <UserDropdown />
      </nav>
    </div>
  );
}

export default TopNav;
