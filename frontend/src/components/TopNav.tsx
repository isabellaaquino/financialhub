import UserDropdown from "./UserDropdown";

function TopNav() {
  return (
    <div className="TopNav z-40">
      <nav className="flex justify-end w-screen border-b border-black-400 py-2 px-6">
        <UserDropdown />
      </nav>
    </div>
  );
}

export default TopNav;
