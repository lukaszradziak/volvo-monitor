import React from "react";
import { HashRouter, Switch, Route } from "react-router-dom";

import Home from "components/pages/Home";
import Monitor from "components/pages/Monitor";
import Parameters from "components/pages/Parameters";
import Settings from "components/pages/Settings";

const App = () => {
  return (
    <>
      <HashRouter>
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/monitor">
            <Monitor />
          </Route>
          <Route path="/parameters">
            <Parameters />
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
