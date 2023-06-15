import { useEffect, useState } from "react";
import { RadioGroup as RadioGroupHeadless } from "@headlessui/react";
import { TypeOption } from "../models/Transaction";

interface Props {
  types: TypeOption[];
  selectedValue: TypeOption;
  handleStateChange: (state: TypeOption) => void;
}

export default function RadioGroup(props: Props) {
  const [selected, setSelected] = useState<TypeOption>(props.selectedValue);

  useEffect(() => {
    props.handleStateChange(selected);
  }, [selected]);

  return (
    <div className="w-full">
      <div className="mx-auto w-full">
        <RadioGroupHeadless value={selected} onChange={setSelected}>
          <RadioGroupHeadless.Label className="sr-only">
            Server size
          </RadioGroupHeadless.Label>
          <div className="space-y-2">
            {props.types.map((type, i) => (
              <RadioGroupHeadless.Option
                defaultChecked={true}
                defaultValue={props.types[0]}
                key={i}
                value={type}
                className={({ active, checked }) =>
                  `
                  ${
                    checked
                      ? " border-green-500  bg-opacity-75"
                      : "border-black-500"
                  }
                  border-2 border-opacity-60 bg-black-500 relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
                }
              >
                {({ active, checked }) => (
                  <>
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-sm">
                          <RadioGroupHeadless.Label
                            as="p"
                            className={`font-medium  ${
                              checked ? "text-white" : "text-white"
                            }`}
                          >
                            {type}
                          </RadioGroupHeadless.Label>
                          <RadioGroupHeadless.Description
                            as="span"
                            className={`inline ${
                              checked ? "text-sky-100" : "text-gray-500"
                            }`}
                          >
                            {/* <span>
                              {type.ram}/{plan.cpus}
                            </span>{" "} */}
                            {/* <span aria-hidden="true">&middot;</span>{" "} */}
                            {/* <span>{plan.disk}</span> */}
                          </RadioGroupHeadless.Description>
                        </div>
                      </div>
                      <span
                        className={`material-symbols-rounded ${
                          checked ? "text-green-500" : "text-white"
                        }`}
                      >
                        {checked
                          ? "radio_button_checked"
                          : "radio_button_unchecked"}
                      </span>
                    </div>
                  </>
                )}
              </RadioGroupHeadless.Option>
            ))}
          </div>
        </RadioGroupHeadless>
      </div>
    </div>
  );
}
