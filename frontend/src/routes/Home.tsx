import { useEffect, useState } from "react";
import dateService from "../api/services/DateService";
import transactionService, {
  Transaction,
} from "../api/services/TransactionService";
import walletService from "../api/services/WalletService";
import Banner from "../components/Banner";
import CurrentMonthChart from "../components/charts/CurrentMonthChart";
import Options from "../components/charts/Options";
import ProfileChart from "../components/charts/ProfileChart";
import EditBalance from "../components/EditBalance";
import LatestTransactions from "../components/LatestTransactions";
import QuickAccess from "../components/QuickAcess";
import SideNav from "../components/SideNav";
import Title from "../components/Title";
import TopNav from "../components/TopNav";
import { useAuth } from "../hooks/useAuth";
import { SummaryOption } from "../models/Summary";

function App() {
  const { authTokens } = useAuth();
  const [currentBalance, setCurrentBalance] = useState<number>(-1.0);
  const [transactions, setTransactions] = useState<Transaction[] | null>();
  const [incomeBalance, setIncomeBalance] = useState<number>(1000.2);
  const [debtBalance, setDebtBalance] = useState<number>(2000.5);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [userHasSavings, setUserHasSavings] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [summaryOptionSelected, setSummaryOptionSelected] =
    useState<SummaryOption>(SummaryOption.Month);

<<<<<<< HEAD
=======
  useEffect(() => {
    //user is not logged out when token expires
    //fetch data using Promise.all to get all in parallel
    walletService.getUserLoggedWallet(authTokens!.access).then((wallet) => {
      setCurrentBalance(Number(wallet!.current_amount));
    });

    transactionService
      .getUserLoggedTransactions(authTokens!.access, dateService.currentYear())
      .then((transactions) => {
        setTransactions(transactions!);
      });
  }, []);

  useEffect(() => {}, [transactions]);

>>>>>>> develop
  function handleSideNav(state: boolean) {
    setIsSideNavOpen(state);
  }

  function openBalanceEditor() {
    setIsOpen(true);
  }

  return (
    <div className="App">
      <EditBalance isOpen={isOpen} handleState={setIsOpen} />
      <SideNav state={isSideNavOpen} handleState={handleSideNav} />
      <TopNav />
      <div className="grid grid-cols-[1fr_500px] gap-6">
        <main
          style={{ marginLeft: !isSideNavOpen ? "120px" : "370px" }}
          className="ml-20 mr-6 py-14"
        >
<<<<<<< HEAD
          <div className="CurrentBalance text-left">
            <h2 className="text-md text-gray-500">Balance</h2>
            <div className="flex items-center gap-4">
              <span className="font-medium text-4xl">
                ${currentBalance.toFixed(2)}
              </span>
              <button onClick={openBalanceEditor} className="cursor-pointer">
                <span className="material-symbols-rounded text-sm text-gray-700 p-1 rounded-md hover:bg-blue-200">
                  edit
                </span>
              </button>
            </div>
          </div>
=======
          {currentBalance >= 0 && (
            <div className="CurrentBalance text-left">
              <h2 className="text-md text-gray-500">Balance</h2>
              <span className="font-medium text-4xl">
                ${currentBalance.toFixed(2)}
              </span>
            </div>
          )}
>>>>>>> develop

          <QuickAccess />

          {/* <Banner text="Planning a trip? Start a personalized SavingPlan now" /> */}

          <div className="Summary mt-10 mr-6">
            <div className="flex flex-row justify-between items-center">
              <Title text="Summary" />
              <Options
                option={summaryOptionSelected}
                handleOption={setSummaryOptionSelected}
              />
              {/* <a className="cursor-pointer material-symbols-rounded p-1 h-full rounded-md text-2xl hover:bg-blue-200">
                more_horiz
              </a> */}
            </div>
            <div className="flex flex-col lg:flex-row justify-start items-start mt-8 gap-14">
              <div className="flex flex-col">
                <div className="bg-blue-100 p-4 rounded-md mb-3">
                  <p className="text-gray-500 text-sm">Income</p>
                  <span className="text-lg text-green-500">
                    +${incomeBalance.toFixed(2)}
                  </span>
                </div>
                <div className="bg-blue-100 p-4 rounded-md">
                  <p className="text-gray-500 text-sm">Debt</p>
                  <span className="text-lg text-red-500">
                    -${debtBalance.toFixed(2)}
                  </span>
                </div>
              </div>
              <div>
                {transactions && (
                  <CurrentMonthChart
                    data={transactions}
                    option={summaryOptionSelected}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="Savings mt-10 mr-6">
            <Title text="My Savings" />
            {!userHasSavings ? (
              <div className="bg-blue-100 p-5 rounded-md">
                <span className="text-gray-500 text-sm">
                  Your SavingsPlan will be displayed here.
                  <a className="text-blue-800 cursor-pointer">
                    {" "}
                    Create new SavingPlan
                  </a>
                  .
                </span>
              </div>
            ) : (
              <div></div>
            )}
          </div>
          {/* <Banner text="Needing insights for your finances? Generate free customized reports of your transactions." /> */}
        </main>
        <div className="hidden lg:block bg-yellow-100 p-14 h-screen">
          <div>
            {transactions && <LatestTransactions data={transactions} />}
            <button
              type="button"
              className="w-full mt-3 rounded-md p-2 text-sm bg-blue-800 text-white"
            >
              Show more
            </button>
          </div>
          <div className="mt-10">
            <div className="flex flex-row justify-between">
              <Title text="Profile" />
              <a className="cursor-pointer material-symbols-rounded p-1 h-full rounded-md text-2xl hover:bg-blue-200">
                more_horiz
              </a>
            </div>
            <ProfileChart />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
