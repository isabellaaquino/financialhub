import { useState } from "react";
import UserDropdown from "./UserDropdown";

function TopNav() {
  return (
    <div className="TopNav absolute">
      <nav className="flex justify-end w-screen py-6 px-12">
        <UserDropdown />
      </nav>
    </div>
  );
}

export default TopNav;
