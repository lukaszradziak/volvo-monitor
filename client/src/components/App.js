import React from "react";
import { HashRouter, Switch, Route } from "react-router-dom";

import Home from "components/pages/Home";
import Settings from "components/pages/Settings";

const App = () => {
  return (
    <>
      <HashRouter>
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/settings">
            <Settings />
          </Route>
        </Switch>
      </HashRouter>
    </>
  );
};

export default App;
