import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useCallback, useState } from "react";
import { DurationOption, TypeOption } from "../models/Transaction";
import transactionService from "../api/services/TransactionService";
import OptionsDropdown from "./OptionsDropdown";
import { capitalizeStr } from "./utils";
import { useAuth } from "../hooks/useAuth";
import ModalLabel from "./ModalLabel";
import RadioGroup from "./RadioGroup";
import SwitchButton from "./SwitchButton";

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
  const [selectedType, setSelectedType] = useState(TypeOption.EXPENSE);
  const [isRecurrent, setIsRecurrent] = useState(false);
  const [isUpdatingWallet, setIsUpdatingWallet] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(DurationOption.DAYS);
  const [error, setError] = useState("");
  const [transactionInput, setTransactionInput] = useState<TransactionInput>({
    title: "",
    description: "",
    value: 0,
    date: new Date().toISOString().split("T")[0],
    type: selectedType,
    updateWallet: isUpdatingWallet,
    recurrent: isRecurrent,
    amount: undefined,
    duration: selectedDuration,
  });

  function closeModal() {
    props.handleState(false);
  }

  const handleTypeChange = (type: TypeOption) => {
    setSelectedType(type);
    setTransactionInput((prevState) => {
      return { ...prevState, ["type"]: type };
    });
  };

  const handleRecurrentChange = (state: boolean) => {
    setIsRecurrent(state);
    setTransactionInput((prevState) => {
      return { ...prevState, ["recurrent"]: state };
    });
  };

  const handleUpdatingWalletChange = (state: boolean) => {
    setIsUpdatingWallet(state);
    setTransactionInput((prevState) => {
      return { ...prevState, ["updateWallet"]: state };
    });
  };

  const handleDurationChange = (duration: DurationOption) => {
    setSelectedDuration(duration);
    setTransactionInput((prevState) => {
      return { ...prevState, ["duration"]: duration };
    });
  };

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<any>) => {
      setTransactionInput((prevState) => {
        let value = e.target.value;
        if (e.target.name === "value") {
          value = parseFloat(e.target.value);
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
            <div className="fixed inset-0 bg-black-500 bg-opacity-40" />
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
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-black-400 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-white"
                  >
                    Add new transaction
                  </Dialog.Title>
                  <form
                    onSubmit={(e) => createTransaction(e)}
                    className="flex flex-col gap-10"
                  >
                    <div className="mt-10">
                      <div>
                        <ModalLabel title="Title" styling="mb-3" />
                        <input
                          name="title"
                          className="w-full text-white pl-3 pr-5 py-2 rounded-md bg-black-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="flex flex-row gap-5">
                      <div className="w-1/2">
                        <ModalLabel title="Amount" styling="mb-2" />
                        <div className="relative">
                          <input
                            className="pl-10 pr-5 py-2 text-white rounded-md bg-black-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                            type="text"
                            name="value"
                            placeholder="0.00"
                            onChange={handleInputChange}
                          />
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="material-symbols-rounded text-2xl font-semibold text-gray-200">
                              attach_money
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="w-1/2">
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
                          className="w-full text-white pl-3 pr-5 py-2 rounded-md bg-black-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div>
                      <ModalLabel title="Type of transaction" styling="mb-5" />
                      <RadioGroup
                        selectedValue={selectedType}
                        handleStateChange={handleTypeChange}
                        types={Object.values(TypeOption)}
                      />
                    </div>
                    <div className="flex flex-row gap-6 items-start justify-center">
                      <div className="bg-black-500 rounded-md p-3 px-4 flex w-full flex-row justify-between gap-3 items-center">
                        <ModalLabel
                          title="Update wallet"
                          tooltipText="Update your current balance with this transaction."
                        />
                        <SwitchButton
                          handleStateChange={handleUpdatingWalletChange}
                        />
                      </div>
                      <div className="bg-black-500 rounded-md p-3 px-4 flex w-full flex-col gap-3 items-center">
                        <div className="flex flex-row justify-between w-full">
                          <ModalLabel
                            title="Recurring"
                            tooltipText="Make this transaction recurring at a specified interval."
                          />
                          <SwitchButton
                            handleStateChange={handleRecurrentChange}
                          />
                        </div>
                        {transactionInput.recurrent && (
                          <div className="flex flex-row items-center mt-5 justify-start w-full">
                            <div className="flex flex-row items-center gap-2">
                              <ModalLabel title="Repeats every" />
                              <input
                                name="amount"
                                className="w-10 text-center appearance-none rounded-md px-1 text-white bg-black-300 focus:outline-none py-2"
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
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-green-500 px-3 py-2 text-sm font-medium text-white hover:bg-green-600 focus:outline-none 
											focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
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
