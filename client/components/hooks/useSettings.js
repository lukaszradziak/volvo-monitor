import { useLocalStorage } from "react-use";

const useSettings = () =>
  useLocalStorage("settings", {
    interval: "100",
    canSpeed: "250",
  });

export default useSettings;
