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

export default function LabelManager(props: Props) {
  const { authTokens } = useAuth();

  function closeModal() {
    props.handleState(false);
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
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
