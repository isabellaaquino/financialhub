import { useState } from "react";
import Banner from "../components/Banner";
import ProfileChart from "../components/charts/ProfileChart";
import LatestTransactions from "../components/LatestTransactions";
import QuickAccess from "../components/QuickAcess";
import SideNav from "../components/SideNav";
import Tab from "../components/Tab";
import Title from "../components/Title";
import TopNav from "../components/TopNav";

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
        <TopNav/>
        <div className="grid grid-cols-[1fr_500px] gap-6">
          <main style={{marginLeft: !isSideNavOpen ? "120px": "370px"}} className="ml-20 mr-6 py-14">
            <div className="CurrentBalance text-left">
              <h2 className="text-md text-gray-500">Balance</h2>
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
          <div className="hidden lg:block bg-yellow-100 p-14 h-screen">
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