import { Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import avatar from "../img/img_avatar.png";

export default function UserDropdown() {
  const { user, SignOut } = useAuth();

  return (
    <div className="w-56 text-right z-10">
      <Menu as="div" className="relative inline-block text-left">
        <div className="flex flex-row items-center">
          <div className="rounded-full bg-gray-300 p-3 inline-flex items-center">
            <span className="text-green-500 text-md">
              {user &&
                user.first_name.charAt(0).toUpperCase() +
                  user.last_name.charAt(0).toUpperCase()}
            </span>
          </div>
          {/* <img src={avatar} className="w-10 rounded-full" alt="Avatar" /> */}
          <Menu.Button className="inline-flex items-center w-full justify-center rounded-md px-4 py-2 text-sm text-white hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
            {/* {user && user.first_name + " " + user.last_name} */}
            <span className="material-symbols-rounded text-xl pl-1">
              expand_more
            </span>
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
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-black-400 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1">
              <Menu.Item>
                {({ active }) => (
                  <button className="group flex w-full items-center rounded-md px-2 py-2 text-sm">
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
                    className="group flex w-full items-center rounded-md px-2 py-2 text-sm"
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
