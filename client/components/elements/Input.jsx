import React from "react";

const Input = (props) => {
  return (
    <>
      <input
        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mb-4"
        {...props}
      />
    </>
  );
};

export default Input;
