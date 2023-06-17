import { useEffect, useState } from "react";
import dateService from "../api/services/DateService";
import transactionService from "../api/services/TransactionService";
import SideNav from "../components/SideNav";
import TopNav from "../components/TopNav";
import { useAuth } from "../hooks/useAuth";
import { Transaction } from "../models/Transaction";
import ConfirmModal from "../components/ConfirmModal";
import { Alert, AlertType } from "../components/Alert";
import ToolTip from "../components/Tooltip";
import OptionsDropdown from "../components/OptionsDropdown";
import { formatValue } from "../utils/utils";
import Title from "../components/Title";
import { useViewPort } from "../hooks/useViewPort";

const WINDOW_BREAKPOINT = 1024;

function Transactions() {
  const { authTokens, isSideNavOpen, setIsSideNavOpen } = useAuth();
  const { width } = useViewPort();

  const [isAlertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<AlertType>(AlertType.WARNING);
  const [transactions, setTransactions] = useState<Transaction[] | null>();
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[] | null
  >();
  const [selectedYear, setSelectedYear] = useState<number>(
    dateService.currentYear()
  );
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  function handleRowClick(index: number) {
    const transaction = transactions?.at(index);
    transaction
      ? setSelectedTransaction(transaction)
      : console.log("Error fetching transaction");
  }

  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  function openConfirmModal(
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    index: number
  ) {
    setSelectedIndex(index);
    setConfirmModalOpen(true);
  }

  function showAlert(message: string, type: string) {
    setAlertMessage(message);
    setAlertType(getAlertType(type));
    setAlertOpen(true);
    setTimeout(() => setAlertOpen(false), 4000);
  }

  const handleDeleteTransaction = async (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    index: number
  ) => {
    event.preventDefault();
    const transactionId = transactions?.at(index)?.id;
    if (transactionId) {
      event.preventDefault();
      setConfirmModalOpen(false);
      const response: { [key: string]: string } | null =
        await transactionService
          .deleteTransactionAPI(authTokens!.access, transactionId)
          .then((response) => {
            searchTransactions();
            return response;
          });
      if (response) {
        showAlert(response.message, response.success);
      }
    }
  };

  function handleSearchChange(event: any) {
    const filtered = transactions?.filter((t) => {
      return t.title.toUpperCase().startsWith(event.target.value.toUpperCase());
    });
    setFilteredTransactions(filtered);
  }

  function handleFormSubmit(event: any) {
    event.preventDefault();
    searchTransactions();
  }

  function searchTransactions() {
    transactionService
      .getUserLoggedTransactions(authTokens!.access, selectedYear)
      .then((transactions) => {
        setTransactions(transactions);
        setFilteredTransactions(transactions);
      });
  }

  useEffect(() => {
    searchTransactions();
  }, []);

  useEffect(() => {
    if (width < WINDOW_BREAKPOINT) setIsSideNavOpen(false);
  }, [width]);

  return (
    <div className="Transactions">
      <Alert
        isOpen={isAlertOpen}
        message={alertMessage}
        type={alertType}
        setAlertOpen={setAlertOpen}
      />
      <SideNav />
      <TopNav />
      <div className="flex flex-row divide-x divide-black-400">
        <div
          className={`py-8 w-full 2xl:w-[60%] z-20 ${
            isSideNavOpen ? "ml-72 mr-8" : "ml-8 md:ml-22 lg:ml-24  md: mr-8"
          }`}
        >
          <Title text="Latest Transactions" />
          <form
            onSubmit={(e) => handleFormSubmit(e)}
            className="flex items-center gap-4 w-full"
          >
            <input
              className="w-full text-sm text-white pl-3 pr-5 py-2 rounded-md bg-black-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              onChange={(e) => handleSearchChange(e)}
              placeholder="Search for transaction"
              type="text"
            />

            <OptionsDropdown
              selectedValue={selectedYear}
              handleValueChange={setSelectedYear}
              options={[2021, 2022, 2023]}
            />

            <button className="bg-green-500 p-2 text-white rounded-md text-sm">
              Search
            </button>
            <ConfirmModal
              isOpen={isConfirmModalOpen}
              handleState={setConfirmModalOpen}
              index={selectedIndex}
              submitDeletion={handleDeleteTransaction}
            />
          </form>
          {filteredTransactions && filteredTransactions.length > 0 ? (
            <div className="flex flex-col mt-5">
              {filteredTransactions &&
                filteredTransactions.map((t, i) => {
                  return (
                    <div
                      onClick={() => handleRowClick(i)}
                      key={t.id}
                      className="flex text-sm flex-row justify-between items-center w-full py-5 px-5 text-white border-b border-black-400 cursor-pointer hover:bg-black-450"
                    >
                      <div className="flex flex-row gap-5 w-[20%]">
                        <div>
                          <div className="rounded-full bg-gray-300 w-12 p-3 inline-flex justify-center items-center">
                            <span className="text-green-500 text-md">
                              {t.title.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <p>{t.title}</p>
                          <span className="text-gray-500">
                            {t.type.toLowerCase()}
                          </span>
                        </div>
                      </div>
                      <div className="w-auto text-gray-200 hidden md:block">
                        {dateService.formatDateValue(t.date)}
                      </div>
                      <div className="w-[20%] text-right">
                        {formatValue(t.value, 10_000)}
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <p className="text-center text-gray-500 text-sm my-5">
              No data found
            </p>
          )}
        </div>
        <div
          className={`md:py-14 fixed right-0 ${
            selectedTransaction && isSideNavOpen ? "lg:left-64" : "lg:left-16"
          } ${selectedTransaction ? "left-0" : ""} 2xl:left-auto h-full ${
            selectedTransaction && "z-20  bg-black-400"
          }`}
        >
          {selectedTransaction && (
            <div className="overflow-hidden">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium leading-6 text-white">
                  Transaction Details
                </h3>
                {/* <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Personal details and application.
                </p> */}
              </div>
              <div className="border-t border-black-400 text-white">
                <dl>
                  <div className="bg-black-500 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-200">Title</dt>
                    <dd className="mt-1 text-sm text-white sm:col-span-2 sm:mt-0">
                      {selectedTransaction.title}
                    </dd>
                  </div>
                  <div className="bg-black-400 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-200">
                      Amount
                    </dt>
                    <dd className="mt-1 text-sm text-white sm:col-span-2 sm:mt-0">
                      {formatValue(selectedTransaction.value, 10_000)}
                    </dd>
                  </div>
                  <div className="bg-black-500 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-200">To</dt>
                    <dd className="mt-1 text-sm text-white sm:col-span-2 sm:mt-0">
                      {selectedTransaction?.to_user}
                    </dd>
                  </div>
                  <div className="bg-black-400 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-200">Date</dt>
                    <dd className="mt-1 text-sm text-white sm:col-span-2 sm:mt-0">
                      {new Date(selectedTransaction.date).toLocaleString()}
                    </dd>
                  </div>
                  <div className="bg-black-500 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-200">Type</dt>
                    <dd className="mt-1 text-sm text-white sm:col-span-2 sm:mt-0">
                      {selectedTransaction.type}
                    </dd>
                  </div>
                  <div className="bg-black-400 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-200">
                      Description
                    </dt>
                    <dd className="mt-1 text-sm text-white sm:col-span-2 sm:mt-0">
                      {selectedTransaction?.description}
                    </dd>
                  </div>
                  <div className="bg-black-500 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-200">
                      Recurrent
                    </dt>
                    <dd className="flex flex-row align-middle gap-1 mt-1 text-sm text-gray-200 sm:col-span-2 sm:mt-0">
                      <input
                        type="checkbox"
                        disabled
                        checked={selectedTransaction.recurrent}
                      />
                      {selectedTransaction.recurrent && (
                        <ToolTip
                          content={`Transaction is cloned every ${
                            selectedTransaction.amount
                          } ${
                            selectedTransaction.duration
                              ? selectedTransaction.duration.toLowerCase()
                              : null
                          }.`}
                        />
                      )}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const getAlertType = (success: string) => {
  if (!!success) return AlertType.SUCCESS;
  else return AlertType.ERROR;
};

export default Transactions;
