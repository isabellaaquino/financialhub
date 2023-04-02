import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { TypeOption, TypeOptionType } from "../models/Transaction";
import TypeDropdown from "./TypeDropdown";
import ToolTip from "./Tooltip";

interface Props {
  isOpen: boolean;
  handleState(state: boolean): void;
}

export default function AddTransaction(props: Props) {
  function capitalize(type: TypeOptionType) {
    const typeStr = type.toString().toLowerCase();
    return typeStr.charAt(0).toUpperCase() + typeStr.slice(1);
  }

  function closeModal() {
    props.handleState(false);
  }

  function createTransaction() {
    closeModal();
  }

  const [selectedType, setSelectedType] = useState(TypeOption.EXPENSE);

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
                <Dialog.Panel className="w-full max-w-xl transform rounded-2xl bg-white p-6 align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 mb-4 text-gray-900"
                  >
                    Add transaction
                  </Dialog.Title>
                  <form className="mt-2 mb-4">
                    <div className="flex flex-row mt-6 mb-6 justify-between">
                      <div>
                        <div className="flex flex-col gap-1 items-center mb-6">
                          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                            Title:
                          </label>
                          <input className="shadow appearance-none border rounded py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline" />
                        </div>
                        <div className="flex flex-col gap-1 items-center mb-6">
                          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                            Description:
                          </label>
                          <textarea className="shadow appearance-none border rounded py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline" />
                        </div>
                        <div className="flex flex-col gap-1 items-center mb-6">
                          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                            Date:
                          </label>
                          <input
                            type="date"
                            className="shadow appearance-none border rounded py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
                          />
                        </div>
                      </div>
                      <div className="mx-auto">
                        <div className="flex flex-col gap-1 items-center mb-6">
                          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                            Value:
                          </label>
                          <div className="flex flex-row items-center gap-1">
                            <span>$</span>
                            <input
                              className="w-16 text-center shadow appearance-none border rounded py-2 px-1 text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
                              placeholder="0.00"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 items-center mb-6">
                          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                            Type of transaction:
                          </label>
                          <TypeDropdown
                            selectedType={selectedType}
                            handleType={setSelectedType}
                          />
                        </div>
                        <div className="flex flex-col gap-1 items-center mb-6">
                          <label className="flex items-top block uppercase tracking-wide text-gray-700 text-xs font-bold">
                            Update wallet?
                            <ToolTip content="Check if you want this transaction to update your current balance." />
                          </label>
                          <input
                            type="checkbox"
                            className="mt-4 leading-tight"
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                  <div>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-3 py-2 text-sm font-medium text-blue-900 hover:bg-gray-200 focus:outline-none 
											focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={createTransaction}
                    >
                      Create {capitalize(selectedType)}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
