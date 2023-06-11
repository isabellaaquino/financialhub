import { useEffect, useState } from "react";
import dateService from "../api/services/DateService";
import transactionService from "../api/services/TransactionService";
import SideNav from "../components/SideNav";
import TopNav from "../components/TopNav";
import YearDropdown from "../components/YearDropdown";
import { useAuth } from "../hooks/useAuth";
import { Transaction, TypeOption } from "../models/Transaction";
import ConfirmModal from "../components/ConfirmModal";
import { Alert, AlertType } from "../components/Alert";
import ModalLabel from "../components/ModalLabel";
import ToolTip from "../components/Tooltip";
import { capitalizeStr } from "../components/utils";

function Transactions() {
  const { authTokens } = useAuth();

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
  const [isSideNavOpen, setIsSideNavOpen] = useState(true);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  function handleSideNav(state: boolean) {
    setIsSideNavOpen(state);
  }

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

  return (
    <div className="Transactions">
      <Alert
        isOpen={isAlertOpen}
        message={alertMessage}
        type={alertType}
        setAlertOpen={setAlertOpen}
      />
      <SideNav state={isSideNavOpen} handleState={handleSideNav} />
      <TopNav />
      <div className="flex flex-row divide-x">
        <div
          className="py-24"
          style={{ marginLeft: !isSideNavOpen ? "120px" : "370px" }}
        >
          {/* <Title text="Latest Transactions" /> */}
          <form
            onSubmit={(e) => handleFormSubmit(e)}
            className="flex items-center gap-4"
          >
            <input
              className="border border-gray-300 w-full rounded-md py-2 pl-3 pr-10 text-sm"
              onChange={(e) => handleSearchChange(e)}
              placeholder="Search for transaction"
              type="text"
            />
            <YearDropdown
              selectedYear={selectedYear}
              handleYear={setSelectedYear}
            />
            <button className="bg-blue-700 p-2 text-white rounded-md text-sm">
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
            <table className="table-auto divide-y w-full text-left text-sm mt-5">
              <thead className="">
                <tr className="text-gray-600">
                  <th className="text-md font-bold w-52 p-2">Name</th>
                  <th className="text-md font-bold w-52">Date</th>
                  <th className="text-md font-bold w-52">Type</th>
                  <th className="text-md font-bold w-52">Amount</th>
                  <th className="text-md font-bold w-52"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredTransactions &&
                  filteredTransactions.map((l, i) => {
                    return (
                      <tr
                        onClick={() => handleRowClick(i)}
                        key={i}
                        className="hover:bg-blue-100 rounded-md cursor-pointer"
                      >
                        <td className="p-2 py-3">{l.title}</td>
                        <td className="text-gray-500">
                          {dateService.formatDateValue(l.date.toLocaleString())}
                        </td>
                        <td className="text-gray-500">
                          <span
                            className={
                              l.type === TypeOption.EXPENSE
                                ? `bg-red-100 p-1 rounded-md text-red-400 font-medium`
                                : l.type === TypeOption.TRANSFER
                                ? `bg-purple-100 p-1 rounded-md text-purple-400 font-medium`
                                : `bg-green-100 p-1 rounded-md text-green-400 font-medium`
                            }
                          >
                            {l.type}
                          </span>
                        </td>
                        <td>${Number(l.value).toFixed(2)}</td>
                        <td data-transaction-pk={l.id}>
                          <span
                            onClick={(e) => openConfirmModal(e, i)}
                            className="material-symbols-rounded opacity-50"
                          >
                            delete
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500 text-sm my-5">
              No data found
            </p>
          )}
        </div>
        <div className="max-w-2xl w-[768px] py-24 fixed right-0 h-full">
          {selectedTransaction && (
            <div className="overflow-hidden">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Transaction Details
                </h3>
                {/* <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Personal details and application.
                </p> */}
              </div>
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-blue-100 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Title</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {selectedTransaction.title}
                    </dd>
                  </div>
                  <div className="bg-blue-100 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Amount
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      ${selectedTransaction.value}
                    </dd>
                  </div>
                  <div className="bg-black-400 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">To</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {selectedTransaction?.to_user}
                    </dd>
                  </div>
                  <div className="bg-blue-100 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Date</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {new Date(selectedTransaction.date).toLocaleString()}
                    </dd>
                  </div>
                  <div className="bg-black-400 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Type</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {selectedTransaction.type}
                    </dd>
                  </div>
                  <div className="bg-blue-100 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Description
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {selectedTransaction?.description}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Recurrent
                    </dt>
                    <dd className="flex flex-row align-middle gap-1 mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
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
