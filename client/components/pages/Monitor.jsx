import { useState } from "react";
import Button from "../elements/Button";
import useParameters from "../hooks/useParameters";
import useSettings from "../hooks/useSettings";

const Monitor = () => {
  const [settings] = useSettings();
  const [parameters] = useParameters();
  const [data, setData] = useState("");
  const [status, setStatus] = useState("");

  const start = async () => {
    setStatus("Loading...");

    const body = new FormData();
    parameters
      .filter((parameter) => parameter.active)
      .forEach((parameter, index) => {
        body.append(index, parameter.address);
      });

    let request = await fetch(
      `http://192.168.4.1/api/monitor/run?canSpeed=${settings.canSpeed}&canAddress=${settings.canAddress}&canInterval=${settings.canInterval}`,
      {
        method: "POST",
        body,
      }
    );
    let text = await request.text();
    console.log(text);
    setStatus("");
    setData(text);
  };

  return (
    <div>
      <Button onClick={() => start()}>Start</Button>
      <p>{status}</p>
      <pre>{data}</pre>
    </div>
  );
};

export default Monitor;
