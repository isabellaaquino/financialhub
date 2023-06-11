import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";

interface Props {
  isOpen: boolean;
  handleState(state: boolean): void;
  currentBalance: number;
  handleCurrentBalance(value: number): void;
}

export default function EditBalance(props: Props) {
  const [currentBalance, setCurrentBalance] = useState<number>(0);

  useEffect(() => {
    setCurrentBalance(props.currentBalance);
  }, []);

  function closeModal() {
    props.handleState(false);
  }

  function updateBalance() {
    // props.handleCurrentBalance(currentBalance);
    // walletService.
    closeModal();
  }

  function handleBalanceChange(event: any) {
    setCurrentBalance(event.target.value);
  }

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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-black-400 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 mb-4 text-gray-900"
                  >
                    Balance Settings
                  </Dialog.Title>
                  <form className="mt-2 mb-4">
                    <div className="flex flex-row gap-1 items-center">
                      <span>$</span>
                      <input
                        type="number"
                        value={currentBalance}
                        onChange={(event) => handleBalanceChange(event)}
                        className="p-2"
                      />
                    </div>
                    <small className="text-sm text-gray-500">
                      You can change it whenever you want.
                    </small>
                  </form>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={updateBalance}
                    >
                      Update Balance
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
