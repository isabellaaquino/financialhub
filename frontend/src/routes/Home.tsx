import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import dateService from "../api/services/DateService";
import transactionService from "../api/services/TransactionService";
import walletService from "../api/services/WalletService";
import CurrentMonthChart from "../components/charts/CurrentMonthChart";
import Options from "../components/charts/Options";
import ProfileChart from "../components/charts/ProfileChart";
import EditBalance from "../components/EditBalance";
import LatestTransactions from "../components/LatestTransactions";
import QuickAccess from "../components/QuickAcess";
import Title from "../components/Title";
import { useAuth } from "../hooks/useAuth";
import { SummaryOption } from "../models/Summary";
import { Transaction } from "../models/Transaction";
import { Alert, AlertType } from "../components/Alert";
import { getAlertType } from "./Transactions";

interface Props {
  isSideNavOpen: boolean;
}

function Home(props: Props) {
  const { authTokens } = useAuth();
  const [currentBalance, setCurrentBalance] = useState<number>(-1.0);
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [incomeBalance, setIncomeBalance] = useState<number>(1000.2);
  const [debtBalance, setDebtBalance] = useState<number>(2000.5);
  const [userHasSavings, setUserHasSavings] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [summaryOptionSelected, setSummaryOptionSelected] =
    useState<SummaryOption>(SummaryOption.Month);

  const [isAlertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<AlertType>(AlertType.WARNING);

  function showAlert(message: string, type: AlertType) {
    setAlertMessage(message);
    setAlertType(getAlertType(type));
    setAlertOpen(true);
    setTimeout(() => setAlertOpen(false), 4000);
  }

  useEffect(() => {
    // user is not logged out when token expires
    // fetch data using Promise.all to get all in parallel
    walletService.getUserLoggedWallet(authTokens!.access).then((wallet) => {
      setCurrentBalance(Number(wallet!.current_amount));
    });

    transactionService
      .getUserLoggedTransactions(authTokens!.access, dateService.currentYear())
      .then((transactions) => {
        setTransactions(transactions!);
      });

    const walletPromise = walletService.getUserLoggedWallet(authTokens!.access);
    const transactionPromise = transactionService.getUserLoggedTransactions(
      authTokens!.access,
      dateService.currentYear()
    );

    Promise.all([walletPromise, transactionPromise]).then((responses) => {
      responses.map((res) => {
        if (res?.status === 200) {
          if (res?.config.url === "/wallet/") {
            setCurrentBalance(Number(res.current_amount));
          } else if (res?.config.url.includes("/transactions")) {
            setTransactions(res);
          }
        }
        // else {
        //   console.log(
        //     "Oops! Unable to fetch data. Please check your internet connection and try again."
        //   );
        // }
      });
    });
  }, []);

  function openBalanceEditor() {
    setIsOpen(true);
  }

  return (
    <div className="App">
      <EditBalance
        isOpen={isOpen}
        handleState={setIsOpen}
        currentBalance={currentBalance}
        handleCurrentBalance={setCurrentBalance}
      />
      <Alert isOpen={isAlertOpen} message={alertMessage} type={alertType} setAlertOpen={setAlertOpen}/>
      {
        <div className="grid grid-cols-[1fr_500px] gap-6">
          <main
            style={{ marginLeft: !props.isSideNavOpen ? "120px" : "370px" }}
            className="ml-20 mr-6 py-14"
          >
            {currentBalance >= 0 && (
              <div className="CurrentBalance text-left">
                <h2 className="text-md text-gray-500">Balance</h2>
                <div className="flex items-center gap-4">
                  <span className="font-medium text-4xl">
                    ${currentBalance}
                  </span>
                  <button
                    onClick={openBalanceEditor}
                    className="cursor-pointer"
                  >
                    <span className="material-symbols-rounded text-sm text-gray-700 p-1 rounded-md hover:bg-blue-200">
                      edit
                    </span>
                  </button>
                </div>
              </div>
            )}

            <QuickAccess showAlert={showAlert}/>

            {/* <Banner text="Planning a trip? Start a personalized SavingPlan now" /> */}

            <div className="Summary mt-10 mr-6">
              <div className="flex flex-row justify-between items-center">
                <Title text="Summary" />
                {transactions && (
                  <Options
                    option={summaryOptionSelected}
                    handleOption={setSummaryOptionSelected}
                  />
                )}
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
                <div className="w-full bg-blue-100 h-56">
                  {transactions ? (
                    <CurrentMonthChart
                      data={transactions}
                      option={summaryOptionSelected}
                    />
                  ) : (
                    <p className="text-center text-gray-500 text-sm mt-24">
                      Unable to load chart due to insufficient data.
                    </p>
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
          <div className="bg-blue-100 p-14 h-screen flex flex-col justify-start">
            <div>
              <LatestTransactions
                isSideNavOpen={props.isSideNavOpen}
                data={transactions}
              />
              <Link to={"/transactions"}>
                <button className="mt-3 w-full bg-blue-800 rounded-md p-2 text-center text-sm text-white">
                  Show more
                </button>
              </Link>
            </div>
            <div className="mt-10">
              <div className="flex flex-row justify-between">
                <Title text="Profile" />
                <a className="cursor-pointer material-symbols-rounded p-1 h-full rounded-md text-2xl hover:bg-blue-200">
                  more_horiz
                </a>
              </div>
              <div>
                {transactions ? (
                  <ProfileChart />
                ) : (
                  <p className="text-center text-gray-500 text-sm mt-28">
                    Unable to load chart due to insufficient data.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  );
}

export default Home;
