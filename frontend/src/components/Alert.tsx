import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

export enum AlertType {
  WARNING = "warning",
  SUCCESS = "success",
  ERROR = "error",
}

interface Props {
  isOpen: boolean;
  message: string;
  type: AlertType;
  setTimeoutHandler?(): void;
  setAlertOpen(state: boolean): void;
}

export function Alert(props: Props) {
  const alertProps = getAlertProps(props.type)
  return (
    <Transition appear show={props.isOpen} as={Fragment}>
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Dialog as="div" onClick={() => props.setAlertOpen(false)} className="absolute mt-6 top-0 left-1/2 -translate-x-1/2 flex justify-center cursor-pointer z-999" onClose={(e) => null}>
          <Dialog.Panel className={`rounded-2xl ${alertProps.color} p-6 shadow-xl transition-all`}>
            <div className="flex flex-row gap-5">
              <div>
                <span className="select-none material-symbols-rounded">{alertProps.icon}</span>
              </div>
              <div className="select-none font-medium text-xl">{props.message}</div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </Transition.Child>
    </Transition>
  );
}

const getAlertProps = (type: AlertType) => {
  switch (type) {
    case AlertType.WARNING:
      return {'color': 'bg-amber-300', 'icon': 'warning', 'hover': 'bg-amber-400'}
    case AlertType.ERROR:
      return {'color': 'bg-red-300', 'icon': 'error', 'hover': 'bg-red-400'}
    case AlertType.SUCCESS:
      return {'color': 'bg-green-300', 'icon': 'check_circle', 'hover': 'bg-green-400'}
  }
}