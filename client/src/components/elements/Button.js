import React from "react";

const Button = (props) => {
  return (
    <button
      className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
      type="button"
      {...props}
    >
      {props.children}
    </button>
  );
};

export default Button;
