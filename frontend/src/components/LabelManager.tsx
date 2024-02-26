import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useCallback, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import ModalLabel from "./ModalLabel";
import labelService from "../api/services/LabelService";
import LabelPicker from "./LabelPicker";
import { CustomLabel } from "../models/CustomLabel";


interface Props {
  isOpen: boolean;
  handleState(state: boolean): void;
  handleAlert(message: string, type: string): void;
}

export default function LabelManager(props: Props) {
  const { authTokens } = useAuth();

  const [labelInput, setLabelInput] = useState<CustomLabel>({
    id: -1,
    name: "",
    color: "",
  });

  function closeModal() {
    props.handleState(false);
  }

  const createLabel = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    closeModal();
    const response = await labelService.createLabelAPI(
     authTokens!.access,
     labelInput
    );
    if (response) {
     props.handleAlert(response.message, response.success);
    }
  };

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<any>) => {
      setLabelInput((prevState) => {return { ...prevState, [e.target.name]: e.target.value };
      });
    },
    [labelInput]
  );

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
                    Add new label
                  </Dialog.Title>
                  <form
                    onSubmit={(e) => createLabel(e)}
                    className="flex flex-col gap-10"
                  >
                    <div className="mt-10 flex flex-col justify-between gap-5">
                      <div>
                        <ModalLabel title="Name" styling="mb-3" />
                        <input
                          name="name"
                          className="w-full text-white pl-3 pr-5 py-2 rounded-md bg-black-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <ModalLabel title="Color" styling="mb-3" />
                        <input name="color" type="color" onChange={handleInputChange}></input>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-green-500 px-3 py-2 text-sm font-medium text-white hover:bg-green-600 focus:outline-none 
											focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                    >
                      Create Label
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
