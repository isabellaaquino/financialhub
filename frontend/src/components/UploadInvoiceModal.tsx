import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import fileService from "../api/services/FileService";
import { useAuth } from "../hooks/useAuth";
import { BankInstitutions } from "../models/Invoices";
import ModalLabel from "./ModalLabel";
import OptionsDropdown from "./OptionsDropdown";

interface Props {
  isOpen: boolean;
  handleState(state: boolean): void;
  handleAlert(message: string, type: string): void;
}

export default function UploadInvoiceModal(props: Props) {
  const { authTokens } = useAuth();

  const [fileStream, setFileStream] = useState<File>(new File([], ""));
  const [bankInstitution, setBankInstitution] = useState<String>("");

  function closeModal() {
    props.handleState(false);
  }

  async function handleOnSubmit(e: any) {
    const file: File = e.target.files[0];
    setFileStream(file);
  }

  const sendFile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await fileService.sendPDFFile(
      authTokens!.access,
      fileStream,
      bankInstitution
    );
    if (response) {
      closeModal();
      props.handleAlert(response.message, response.success);
    }
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
                    Import Invoice
                  </Dialog.Title>
                  <form
                    onSubmit={(e) => sendFile(e)}
                    className="flex flex-col gap-10"
                  >
                    <div className="mt-10 flex flex-row justify-between gap-10">
                      <div className="w-full">
                        <ModalLabel title="PDF" styling="mb-3" />
                        <input
                          type="file"
                          className="w-full text-white pl-3 pr-5 py-2 rounded-md bg-black-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                          onChange={handleOnSubmit}
                        />
                      </div>
                      <div className="w-full">
                        <ModalLabel title="Bank Institution" styling="mb-3" />
                        <OptionsDropdown
                          selectedValue={bankInstitution}
                          handleValueChange={(e) => setBankInstitution(e)}
                          options={Object.values(BankInstitutions)}
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-green-500 px-3 py-2 text-sm font-medium text-white hover:bg-green-600 focus:outline-none 
											focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                    >
                      Process File
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
