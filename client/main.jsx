import { render } from "react-dom";
import { HashRouter, Routes, Route } from "react-router-dom";

import App from "./components/App";

import Home from "./components/pages/Home";
import Monitor from "./components/pages/Monitor";
import Parameters from "./components/pages/Parameters";
import Settings from "./components/pages/Settings";

import "./style.css";

render(
  <HashRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="monitor" element={<Monitor />} />
        <Route path="parameters" element={<Parameters />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  </HashRouter>,
  document.getElementById("root")
);
