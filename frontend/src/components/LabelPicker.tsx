import { Listbox, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useAuth } from "../hooks/useAuth";
import { CustomLabel } from "../models/CustomLabel";

interface Props {
  selectedLabel: CustomLabel;
  setSelectedLabel: (state: CustomLabel) => void;
  labels?: CustomLabel[];
}

export default function LabelPicker(props: Props) {
  const { authTokens } = useAuth();

  return (
    <div>
      <Listbox value={props.selectedLabel} onChange={props.setSelectedLabel}>
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-default rounded-lg text-white bg-black-300 py-2 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus-visible:border-green-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-green-300 sm:text-sm">
            <span
              className={`py-0.5 px-2 w-2 ${
                props.selectedLabel.name ? "border rounded-2xl" : ""
              } font-normal`}
              style={
                props.selectedLabel && {
                  borderColor: `${props.selectedLabel?.color}`,
                }
              }
            >
              {props.selectedLabel?.name}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <span className="material-symbols-rounded text-xl pl-1">
                expand_more
              </span>
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="z-10 w-full absolute mt-1 overflow-auto rounded-md bg-black-300 py-1 text-base shadow-lg ring-1 ring-black-400 ring-opacity-5 focus:outline-none sm:text-sm">
              {props.labels?.map((label, i) => (
                <Listbox.Option
                  key={i}
                  className={({ active }) =>
                    `w-full relative cursor-pointer select-none py-1 pl-4 pr-4 ${
                      active ? "text-white" : "text-white"
                    }`
                  }
                  value={label}
                >
                  {({ selected }) => (
                    <div className="w-100">
                      <span
                        className={`py-0.5 px-2 w-2  ${
                          selected ? "font-semibold" : "font-normal"
                        }`}
                        style={{ borderColor: `${label.color}` }}
                      >
                        {label.name}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600"></span>
                      ) : null}
                    </div>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
