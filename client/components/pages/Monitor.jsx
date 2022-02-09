import { useEffect, useState } from "react";
import { useInterval } from "react-use";
import Button from "../elements/Button";
import useParameters from "../hooks/useParameters";
import useSettings from "../hooks/useSettings";

const Monitor = () => {
  const [settings] = useSettings();
  const [parameters] = useParameters();

  const [data, setData] = useState("");

  const [started, setStarted] = useState(false);
  const [blockInterval, setBlockInterval] = useState(false);

  const fetchStart = async () => {
    const body = new FormData();
    parameters
      .filter((parameter) => parameter.active)
      .forEach((parameter, index) => {
        body.append(index, parameter.address);
      });

    await fetch(
      `http://192.168.4.1/api/monitor/start?canSpeed=${settings.canSpeed}&canAddress=${settings.canAddress}&canInterval=${settings.canInterval}`,
      {
        method: "POST",
        body,
      }
    );
  };

  const fetchStop = async () => {
    await fetch(
      `http://192.168.4.1/api/monitor/stop?canSpeed=${settings.canSpeed}&canAddress=${settings.canAddress}&canInterval=${settings.canInterval}`,
      {
        method: "POST",
      }
    );
  };

  const fetchData = async () => {
    const request = await fetch(`http://192.168.4.1/api/monitor/data`);
    return await request.text();
  };

  useInterval(
    async () => {
      setBlockInterval(true);

      if (settings.canInterval === "01") {
        await fetchStart();
      }

      const data = await fetchData();
      setData((old) => old + data);

      setBlockInterval(false);
    },
    started && !blockInterval ? settings.interval : null
  );

  useEffect(() => {
    return () => {
      fetchStop();
    };
  }, []);

  const start = async () => {
    await fetchStart();
    setStarted(true);
  };

  const stop = async () => {
    setStarted(false);
    await fetchStop();
  };

  return (
    <>
      <div>
        <Button onClick={() => start()} color={started ? null : `primary`}>
          Start
        </Button>
        <Button onClick={() => stop()} color={started ? `primary` : null}>
          Stop
        </Button>
        <span className="mr-2">Started: {started ? `yes` : `no`}</span>
        <span className="mr-2">Length: {data.split("\n").length}</span>
      </div>
      <pre>{data}</pre>
    </>
  );
};

export default Monitor;
