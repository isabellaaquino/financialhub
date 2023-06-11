import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useCallback, useState } from "react";
import { DurationOption, TypeOption } from "../models/Transaction";
import transactionService from "../api/services/TransactionService";
import OptionsDropdown from "./OptionsDropdown";
import { capitalizeStr } from "./utils";
import { useAuth } from "../hooks/useAuth";
import ModalLabel from "./ModalLabel";

export interface TransactionInput {
  title?: string;
  description?: string;
  value: number;
  date?: string;
  updateWallet: boolean;
  type: TypeOption;
  recurrent: boolean;
  amount?: number;
  duration?: DurationOption;
}

interface Props {
  isOpen: boolean;
  handleState(state: boolean): void;
  handleAlert(message: string, type: string): void;
}

export default function AddTransaction(props: Props) {
  const { authTokens } = useAuth();

  function closeModal() {
    props.handleState(false);
  }

  const [selectedType, setSelectedType] = useState(TypeOption.EXPENSE);
  const [selectedDuration, setSelectedDuration] = useState(DurationOption.DAYS);

  const handleTypeChange = (type: TypeOption) => {
    setSelectedType(type);
    setTransactionInput((prevState) => {
      return { ...prevState, ["type"]: type };
    });
  };

  const handleDurationChange = (duration: DurationOption) => {
    setSelectedDuration(duration);
    setTransactionInput((prevState) => {
      return { ...prevState, ["duration"]: duration };
    });
  };

  const [error, setError] = useState("");

  const [transactionInput, setTransactionInput] = useState<TransactionInput>({
    title: "",
    description: "",
    value: 0,
    date: new Date().toISOString(),
    type: selectedType,
    updateWallet: false,
    recurrent: false,
    amount: undefined,
    duration: selectedDuration,
  });

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<any>) => {
      setTransactionInput((prevState) => {
        let value = e.target.value;
        if (e.target.name === "value") {
          value = parseFloat(e.target.value);
        } else if (e.target.name === "updateWallet") {
          value = e.target.checked;
        } else if (e.target.name === "recurrent") {
          value = e.target.checked;
        }
        return { ...prevState, [e.target.name]: value };
      });
    },
    [transactionInput]
  );

  const createTransaction = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    closeModal();
    const response = await transactionService.createTransactionAPI(
      authTokens!.access,
      transactionInput
    );
    if (response) {
      props.handleAlert(response.message, response.success);
    } else setError("Register error");
  };

  return (
    <>
      <Transition appear show={props.isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-xl transform rounded-2xl bg-black-400 p-6 align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 mb-4 text-gray-900"
                  >
                    Add transaction
                  </Dialog.Title>
                  <form
                    onSubmit={(e) => createTransaction(e)}
                    className="mt-2 mb-4"
                  >
                    <div className="flex flex-row mt-6">
                      <div>
                        <div className="flex flex-col gap-1 mb-6">
                          <ModalLabel title="Title" styling="mb-2" />
                          <input
                            name="title"
                            className="appearance-none border rounded py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
                            onChange={handleInputChange}
                          />
                        </div>
                        <ModalLabel
                          title={
                            transactionInput.recurrent ? "Start date" : "Date"
                          }
                          styling="mb-2"
                        />
                        <input
                          name={
                            transactionInput.recurrent ? "startDate" : "date"
                          }
                          type="date"
                          className="appearance-none border rounded py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="mx-auto">
                        <div className="flex flex-col gap-1 items-center mb-6">
                          <ModalLabel title="Value" styling="mb-2" />
                          <div className="flex flex-row border items-center rounded text-lg w-min-full py-1 gap-1">
                            <span className="material-symbols-rounded">
                              attach_money
                            </span>
                            <input
                              name="value"
                              className="w-16 text-gray-900 focus:outline-none"
                              placeholder="0.00"
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 items-center mb-6">
                          <ModalLabel
                            title="Type of transaction"
                            styling="mb-2"
                          />
                          <OptionsDropdown
                            selectedType={selectedType}
                            handleType={(e: TypeOption) => handleTypeChange(e)}
                            options={TypeOption}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 justify-around mb-6">
                      <div className="flex flex-col gap-1 items-center mb-6">
                        <ModalLabel title="Description" styling="mb-2" />
                        <textarea
                          name="description"
                          className="appearance-none border rounded py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="flex flex-row gap-1 items-center justify-around">
                      <div className="flex flex-col gap-1 items-center mb-6">
                        <ModalLabel
                          title="Update wallet?"
                          tooltipText="Check if you want this transaction to update your current balance."
                        />
                        <input
                          name="updateWallet"
                          type="checkbox"
                          className="mt-4 leading-tight"
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="flex flex-col gap-1 items-center mb-6">
                        <ModalLabel
                          title="Is recurrent?"
                          tooltipText="Check this if you want this transaction to be replicated in a certain amount of time."
                        />
                        <input
                          name="recurrent"
                          type="checkbox"
                          className="mt-4 leading-tight"
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    {transactionInput.recurrent && (
                      <div className="flex flex-row items-center mb-6 justify-center">
                        <div className="flex flex-row items-center gap-2">
                          <ModalLabel title="Copied Every" />
                          <input
                            name="amount"
                            className="w-10 text-center appearance-none rounded py-2 px-1 text-gray-900 focus:outline-none py-1"
                            placeholder="0"
                            onChange={handleInputChange}
                          />
                          <OptionsDropdown
                            selectedType={selectedDuration}
                            handleType={(e: DurationOption) =>
                              handleDurationChange(e)
                            }
                            options={DurationOption}
                          />
                        </div>
                      </div>
                    )}
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-3 py-2 text-sm font-medium text-blue-900 hover:bg-gray-200 focus:outline-none 
											focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                      Create {capitalizeStr(selectedType)}
                    </button>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
