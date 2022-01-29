import { Outlet } from "react-router-dom";

import Main from "./blocks/Main";
import Footer from "./blocks/Footer";
import Header from "./blocks/Header";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Main>
        <Outlet />
      </Main>
      <Footer />
    </div>
  );
};

export default App;
