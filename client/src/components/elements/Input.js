import React from "react";

const Input = (props) => {
  return (
    <>
      <input
        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-4 mb-4"
        {...props}
      />
    </>
  );
};

export default Input;
