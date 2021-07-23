import React from "react";

import DefaultTheme from "components/templates/DefaultTheme";

import { settingsStore } from "components/store/settings";

const Monitor = () => {
  const [settings] = settingsStore();

  return (
    <DefaultTheme title="Monitor">
      <p>Monitor Page</p>
      <p>Refresh Interval: {settings.refreshInterval}ms</p>
    </DefaultTheme>
  );
};

export default Monitor;
