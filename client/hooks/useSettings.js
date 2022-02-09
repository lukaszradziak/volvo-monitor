import { useLocalStorage } from "react-use";

const useSettings = () =>
  useLocalStorage("settings", {
    interval: "100",
    canSpeed: "250",
    canAddress: "7A",
    canInterval: "04",
  });

export default useSettings;
