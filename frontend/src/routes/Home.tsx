import { useEffect, useState } from "react";
import transactionService, {
  Transaction,
} from "../api/services/TransactionService";
import walletService from "../api/services/WalletService";
import Banner from "../components/Banner";
import CurrentMonthChart from "../components/charts/CurrentMonthChart";
import Options from "../components/charts/Options";
import ProfileChart from "../components/charts/ProfileChart";
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
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [incomeBalance, setIncomeBalance] = useState<number>(1000.2);
  const [debtBalance, setDebtBalance] = useState<number>(2000.5);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [userHasSavings, setUserHasSavings] = useState(false);
  const [summaryOptionSelected, setSummaryOptionSelected] =
    useState<SummaryOption>(SummaryOption.Month);
  const [lineChartData, setLineChartData] = useState<
    { x: string; y: string | number }[]
  >([]);

  useEffect(() => {
    //user is not logged out when token expires
    //fetch data using Promise.all to get all in parallel
    walletService.getUserLoggedWallet(authTokens!.access).then((wallet) => {
      setCurrentBalance(Number(wallet!.current_amount));
    });

    transactionService
      .getUserLoggedTransactions(authTokens!.access)
      .then((transactions) => {
        setTransactions(transactions!);
      });
  }, []);

  useEffect(() => {
    let categories: string[] = [];
    const result = createLineChartData();

    result.map((transaction) => {
      categories.push(transaction.date);
    });

    const dataSet = categories.map((c) => {
      const data = result.find(({ date, value }) => date === c);
      return { x: c, y: data ? data.value : 0 };
    });

    setLineChartData(dataSet);
  }, [transactions]);

  console.log(lineChartData);

  function createLineChartData() {
    let dataSet: { [id: string]: string }[] = [];

    transactions?.map((transaction) => {
      let dict: { [id: string]: string } = {};
      dict["date"] = new Date(
        Date.parse(transaction.date)
      ).toLocaleDateString();
      dict["value"] = transaction.value.toString();
      dataSet.push(dict);
    });

    const map = dataSet.reduce((acc, { date, value }) => {
      let val = Number(value) + (Number(acc[date]) || 0);
      acc[date] = val.toFixed(2);
      return acc;
    }, {});

    let result: { [id: string]: string }[] = [];
    Object.entries(map).map(([key, value]) => {
      result.push({ date: key, value: value });
    });

    return result;
  }

  function handleSideNav(state: boolean) {
    setIsSideNavOpen(state);
  }

  return (
    <div className="App">
      <SideNav state={isSideNavOpen} handleState={handleSideNav} />
      <TopNav />
      <div className="grid grid-cols-[1fr_500px] gap-6">
        <main
          style={{ marginLeft: !isSideNavOpen ? "120px" : "370px" }}
          className="ml-20 mr-6 py-14"
        >
          {currentBalance >= 0 && (
            <div className="CurrentBalance text-left">
              <h2 className="text-md text-gray-500">Balance</h2>
              <span className="font-medium text-4xl">
                ${currentBalance.toFixed(2)}
              </span>
            </div>
          )}

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
                <CurrentMonthChart data={lineChartData} />
                {/* {lineChartData && <CurrentMonthChart data={lineChartData} />} */}
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
