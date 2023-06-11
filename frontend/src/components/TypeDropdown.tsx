import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { TypeOption, TypeOptionType } from "../models/Transaction";

interface Props {
  selectedType: TypeOptionType;
  handleType: any;
}

export default function TypeDropdown(props: Props) {
  return (
    <div className="w-18">
      <Listbox value={props.selectedType} onChange={props.handleType}>
        <div className="relative">  
          {/* border border-gray-300 w-full rounded-md h-8 px-4 mb-2 text-sm */}
          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-black-400 py-2 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
            <span className="block truncate text-center">
              {props.selectedType.toUpperCase()}
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
            <Listbox.Options className="z-10 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-black-400 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {Object.keys(TypeOption).map((type, i) => (
                <Listbox.Option
                  key={i}
                  className={({ active }) =>
                    ` relative cursor-pointer select-none py-2 pl-5 pr-4 ${
                      active ? "bg-amber-100 text-amber-900" : "text-gray-900"
                    }`
                  }
                  value={type}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-semibold" : "font-normal"
                        }`}
                      >
                        {type}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                          {/* <CheckIcon className="h-5 w-5" aria-hidden="true" /> */}
                        </span>
                      ) : null}
                    </>
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
