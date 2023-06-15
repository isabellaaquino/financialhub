import { useEffect, useState } from "react";
import { Switch } from "@headlessui/react";

interface Props {
  handleStateChange: (state: boolean) => void;
}

export default function SwitchButton(props: Props) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    props.handleStateChange(enabled);
  }, [enabled]);

  return (
    <div className="">
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className={`${enabled ? "bg-green-500" : "bg-black-300"}
          relative inline-flex h-[25px] w-[48px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
      >
        <span className="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          className={`${enabled ? "translate-x-6" : "translate-x"}
            pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
        />
      </Switch>
    </div>
  );
}
