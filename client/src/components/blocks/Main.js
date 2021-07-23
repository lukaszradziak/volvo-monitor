import React from "react";

const Main = ({ children }) => {
  return (
    <main className="bg-gray-50 flex-1">
      <div className="max-w-7xl mx-auto py-6 px-4">{children}</div>
    </main>
  );
};

export default Main;
