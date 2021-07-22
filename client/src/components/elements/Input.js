import React from "react";

const Input = (props) => {
  return (
    <input
      type="text"
      className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full mb-5"
      {...props}
    />
  );
};

export default Input;
