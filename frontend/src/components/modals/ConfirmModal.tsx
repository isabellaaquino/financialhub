// import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

interface Props {
  index: number;
  isOpen: boolean;
  handleState(state: boolean): void;
  submitDeletion(e: React.MouseEvent, index: number): void;
}

export default function ConfirmModal(props: Props) {
  function closeModal() {
    props.handleState(false);
  }

  return (
    <>
      {/* <Transition appear show={props.isOpen} as={Fragment}>
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
                <Dialog.Panel className="max-w-md transform rounded-2xl bg-black-400 p-6 align-middle shadow-xl transition-all">
                  <span className="material-symbols-rounded">warning</span>
                  <Dialog.Title
                    as="h1"
                    className="text-lg font-medium leading-6 mb-4 text-gray-900"
                  >
                    Are you sure you want to delete this transaction? This
                    action can't be undone.
                  </Dialog.Title>
                  <div className="flex flex-row justify-center gap-5">
                    <button
                      onClick={closeModal}
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-3 py-2 text-sm font-medium text-blue-900 hover:bg-gray-200 focus:outline-none 
											focus-visible:ring-2 focus-visible:ring-green-500-500 focus-visible:ring-offset-2"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={(e) => props.submitDeletion(e, props.index)}
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-3 py-2 text-sm font-medium text-blue-900 hover:bg-gray-200 focus:outline-none 
											focus-visible:ring-2 focus-visible:ring-green-500-500 focus-visible:ring-offset-2"
                    >
                      Delete
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition> */}
    </>
  );
}
