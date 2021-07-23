import useLocalStorage from "use-local-storage";

export const intervalTimes = [1000, 500, 200, 100, 50];

export const settingsStore = () =>
  useLocalStorage("settings", {
    backendUrl: "localhost",
    refreshInterval: intervalTimes[0],
  });
