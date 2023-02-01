function SideNav() {
  return (
    <div className="SideNav">
      <nav className="h-screen bg-blue-500 w-14">
        <div className="flex flex-col items-center">
          <a href="#" className="mt-10">
            <span className="material-symbols-rounded text-white">home</span>
          </a>
          <a href="#" className="mt-5">
            <span className="material-symbols-rounded text-white">
              monitoring
            </span>{" "}
          </a>
          <a href="#" className="mt-5">
            <span className="material-symbols-rounded text-white">
              leaderboard
            </span>
          </a>
        </div>
      </nav>
    </div>
  );
}

export default SideNav;
