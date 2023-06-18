import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useAuth } from "../hooks/useAuth";

export default function UserDropdown() {
  const { user, SignOut } = useAuth();

  return (
    <div className="w-56 text-right z-40">
      <Menu as="div" className="relative inline-block text-left">
        <div className="flex flex-row items-center">
          <Menu.Button className="p-1 md:p-1 rounded-full hover:md:bg-black-400 focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-opacity-75">
            <div className="rounded-full bg-gray-300 p-4 md:p-2 inline-flex items-center">
              <span className="text-green-500 text-sm font-semibold">
                {user &&
                  user.first_name.charAt(0).toUpperCase() +
                    user.last_name.charAt(0).toUpperCase()}
              </span>
            </div>
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-1 w-56 origin-top-right divide-y divide-black-300 rounded-md border border-black-300 bg-black-400 focus:outline-none">
            <div className="px-1 py-1">
              <Menu.Item>
                {({ active }) => (
                  <button className="group flex w-full items-center rounded-md px-2 py-2 text-white text-sm hover:bg-green-500">
                    <span className="material-symbols-rounded pr-2">build</span>{" "}
                    Settings
                  </button>
                )}
              </Menu.Item>
            </div>
            <div className="px-1 py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={SignOut}
                    className="group flex w-full items-center rounded-md px-2 py-2 text-white text-sm hover:bg-green-500"
                  >
                    <span className="material-symbols-rounded pr-2">
                      logout
                    </span>
                    Sign Out
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
