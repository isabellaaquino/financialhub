import { useState } from "react";
import "./App.css";
import Banner from "./components/Banner";
import CurrentMonthChart from "./components/charts/CurrentMonthChart";
import ProfileChart from "./components/charts/ProfileChart";
import LatestTransactions from "./components/LatestTransactions";
import QuickAccess from "./components/QuickAcess";
import SideNav from "./components/SideNav";
import Tab from "./components/Tab";
import Title from "./components/Title";

function App() {
  const [currentBalance, setCurrentBalance] = useState<number>(2000.5);
  const [incomeBalance, setIncomeBalance] = useState<number>(1000.2);
  const [debtBalance, setDebtBalance] = useState<number>(2000.5);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);

  function handleSideNav(state: boolean) {
    setIsSideNavOpen(state);
  }

  return (
    <div className="App">
      <SideNav state={isSideNavOpen} handleState={handleSideNav} />
      <div className="flex flex-col md:flex-row justify-between">
        <main style={{marginLeft: !isSideNavOpen ? "80px": "330px"}} className="ml-20 py-5 flex-1 w-[1200px] mr-6">
          <div className="CurrentBalance text-left">
            <h2 className="text-lg text-gray-500">Balance</h2>
            <span className="font-medium text-4xl">
              ${currentBalance.toFixed(2)}
            </span>
          </div>

          <QuickAccess />

          <Banner text="Planning a trip? Start a personalized SavingPlan now" />

          <div className="ThisMonth mt-10 mr-6">
            <Title text="Summary" />
            <div className="flex sm:flex-col justify-center xl:flex-row mr-6">
              <Tab />
            </div>
          </div>

          {/* <Banner text="Needing insights for your finances? Generate free customized reports of your transactions." /> */}
        </main>
        <div className="hidden lg:block flex-1 bg-yellow-100 p-14 h-screen">
          <LatestTransactions />
          <div className="mt-10">
            <Title text="Profile" />
            <ProfileChart />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
