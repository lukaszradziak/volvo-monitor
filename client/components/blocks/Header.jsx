import { NavLink } from "react-router-dom";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Monitor", href: "/monitor" },
  { name: "Sniffer", href: "/sniffer" },
  { name: "Parameters", href: "/parameters" },
  { name: "Settings", href: "/settings" },
];

import { Disclosure } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";

const Header = () => {
  return (
    <Disclosure as="nav" className="bg-primary-600">
      {({ open, close }) => (
        <>
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              <div className="flex items-center px-2 lg:px-0">
                <div className="flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="hidden lg:block lg:ml-6">
                  <div className="flex space-x-4">
                    {navigation.map((link) => (
                      <NavLink
                        to={link.href}
                        key={link.name}
                        className={({ isActive }) =>
                          `${
                            isActive
                              ? `bg-primary-700 text-white`
                              : `text-gray-300`
                          }  hover:bg-primary-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium `
                        }
                      >
                        {link.name}
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex lg:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((link) => (
                <NavLink
                  to={link.href}
                  key={link.name}
                  className={({ isActive }) =>
                    `${
                      isActive ? `bg-primary-700 text-white` : `text-gray-300`
                    }  text-gray-300 hover:bg-primary-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium`
                  }
                  onClick={close}
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Header;
