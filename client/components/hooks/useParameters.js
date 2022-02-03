import { useLocalStorage } from "react-use";

const useParameters = () => useLocalStorage("parameters", []);

export default useParameters;
