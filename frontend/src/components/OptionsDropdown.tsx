import { Listbox, Transition } from "@headlessui/react";
import { Fragment } from "react";

interface Props {
  selectedValue: any;
  handleValueChange: React.Dispatch<React.SetStateAction<any>>;
  options: any[];
}

export default function OptionsDropdown(props: Props) {
  return (
    <div>
      <Listbox value={props.selectedValue} onChange={props.handleValueChange}>
        <div className="relative">
          {/* border border-gray-300 w-full rounded-md h-8 px-4 mb-2 text-sm */}
          <Listbox.Button className="relative w-full cursor-default rounded-lg text-white bg-black-300 py-2 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus-visible:border-green-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-green-300 sm:text-sm">
            <span className="py-1 px-2 w-full font-normal">
              {props.selectedValue}
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
              {props.options.map((value, i) => (
                <Listbox.Option
                  key={i}
                  className={({ active }) =>
                    `w-full relative cursor-pointer select-none py-2 pl-6 pr-6 ${
                      active ? "bg-green-500 text-white" : "text-white"
                    }`
                  }
                  value={value}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block ${
                          selected ? "font-semibold" : "font-normal"
                        }`}
                      >
                        {value}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center  text-amber-600">
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
