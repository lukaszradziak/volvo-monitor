import { useEffect, useState } from "react";
import Button from "../elements/Button";
import useParameters from "../hooks/useParameters";
import useSettings from "../hooks/useSettings";

const Monitor = () => {
  const [settings] = useSettings();
  const [parameters] = useParameters();
  const [data, setData] = useState("");
  const [status, setStatus] = useState("");
  const [started, setStared] = useState(false);

  useEffect(() => {
    let id;

    const loop = async () => {
      let request = await fetch(`http://192.168.4.1/api/monitor/data`);
      let text = await request.text();
      setData((data) => data + text);

      id = setTimeout(loop, parseInt(settings.interval));
    };

    if (started) {
      loop();
    }

    return () => {
      clearTimeout(id);
    };
  }, [started]);

  useEffect(() => {
    return () => {
      stop();
    };
  }, []);

  const start = async () => {
    setData("");
    setStatus("Loading...");

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
    setStatus("");
    setStared(true);
  };

  const stop = async () => {
    setStared(false);

    await fetch(
      `http://192.168.4.1/api/monitor/stop?canSpeed=${settings.canSpeed}&canAddress=${settings.canAddress}&canInterval=${settings.canInterval}`,
      {
        method: "POST",
      }
    );
  };

  return (
    <div>
      <Button onClick={() => start()} color={started ? null : `primary`}>
        Start
      </Button>
      <Button onClick={() => stop()} color={started ? `primary` : null}>
        Stop
      </Button>
      <p>{status}</p>
      <pre>{data}</pre>
    </div>
  );
};

export default Monitor;
