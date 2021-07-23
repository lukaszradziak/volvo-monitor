import React from "react";

import Header from "components/blocks/Header";
import Main from "components/blocks/Main";
import Footer from "components/blocks/Footer";

const DefaultTheme = ({ title, children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header title={title} />
      <Main>{children}</Main>
      <Footer />
    </div>
  );
};

export default DefaultTheme;
