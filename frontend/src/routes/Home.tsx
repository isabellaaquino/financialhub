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
import QuickAccess from "../components/QuickAccess";
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

    // const walletPromise = walletService.getUserLoggedWallet(authTokens!.access);
    // const transactionPromise = transactionService.getUserLoggedTransactions(
    //   authTokens!.access,
    //   dateService.currentYear()
    // );

    // Promise.all([walletPromise, transactionPromise]).then((responses) => {
    //   responses.map((res) => {
    //     if (res?.status === 200) {
    //       if (res?.config.url === "/wallet/") {
    //         setCurrentBalance(Number(res.current_amount));
    //       } else if (res?.config.url.includes("/transactions")) {
    //         setTransactions(res);
    //       }
    //     } else {
    //       console.log(
    //         "Oops! Unable to fetch data. Please check your internet connection and try again."
    //       );
    //     }
    //   });
    // });
  }, []);

  function openBalanceEditor() {
    setIsOpen(true);
  }
  console.log(transactions);

  return (
    <div className="App">
      <EditBalance
        isOpen={isOpen}
        handleState={setIsOpen}
        currentBalance={currentBalance}
        handleCurrentBalance={setCurrentBalance}
      />
      <Alert
        isOpen={isAlertOpen}
        message={alertMessage}
        type={alertType}
        setAlertOpen={setAlertOpen}
      />
      {
        <div className="w-full">
          <main
            style={{
              margin: `${
                props.isSideNavOpen ? "0 30px 0 280px" : "0 30px 0 90px"
              }`,
            }}
            className="ml-20 mr-6"
          >
            <div className="w-full">
              <h1 className="text-4xl font-semibold text-white">Overview</h1>
              <div className="mt-3 py-10 w-full">
                {currentBalance >= 0 && (
                  <div className="divide-x divide-black-400 flex flex-col lg:flex-row justify-center items-stretch gap-3">
                    <div className="flex flex-col md:flex-row lg:flex-col gap-3">
                      <div className="CurrentBalance bg-black-400 rounded-md shadow-sm text-left p-10">
                        <h2 className="text-md text-green-500">Balance</h2>
                        <div className="flex items-center gap-4">
                          <span className="font-medium text-4xl text-white">
                            {" "}
                            {currentBalance.toLocaleString("en-US", {
                              style: "currency",
                              currency: "USD",
                            })}
                          </span>
                          <button
                            onClick={openBalanceEditor}
                            className="cursor-pointer"
                          >
                            <span className="material-symbols-rounded text-lg text-gray-700 p-1 rounded-md hover:bg-blue-200">
                              edit
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="bg-black-400 w-full rounded-md shadow-sm flex flex-col divide-y divide-black-500 py-5 px-7 gap-2">
                        <div className="flex flex-row gap-5 items-center justify-start">
                          <span className="material-symbols-rounded bg-green-100 p-2 rounded-lg text-green-700">
                            trending_up
                          </span>
                          <div className="pr-10 mb-3">
                            <p className="text-gray-500 text-sm">Incoming</p>
                            <span className="text-lg text-white">
                              ${incomeBalance.toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-row gap-5 items-center justify-start pt-5">
                          <span className="material-symbols-rounded bg-red-100 p-2 rounded-lg text-red-700">
                            trending_down
                          </span>
                          <div className="pr-10">
                            <p className="text-gray-500 text-sm">Outgoing</p>
                            <span className="text-lg text-white">
                              ${debtBalance.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-black-400 rounded-md w-full py-10 shadow-sm hidden sm:block">
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
                )}
              </div>
              <div className="rounded-md pt-5 py-10">
                <QuickAccess showAlert={showAlert}/>
              </div>
            </div>

            {/* <Banner text="Planning a trip? Start a personalized SavingPlan now" /> */}

            <div className="flex flex-col lg:flex-row mt-5 gap-5">
              <div className="bg-black-400 p-10 rounded-md lg:w-2/3">
                <LatestTransactions
                  isSideNavOpen={props.isSideNavOpen}
                  data={transactions}
                />
                <Link to={"/transactions"}>
                  <button className="mt-5 w-full bg-green-500 rounded-md p-2 text-center text-sm text-white hover:bg-green-600">
                    Show more
                  </button>
                </Link>
              </div>
              <div className="bg-black-400 p-10 rounded-md w-1/3">
                <ProfileChart />
              </div>
            </div>

            {/* <div className="Savings mt-10 mr-6">
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
            </div> */}
            {/* <Banner text="Needing insights for your finances? Generate free customized reports of your transactions." /> */}
          </main>
        </div>
      }
    </div>
  );
}

export default Home;
