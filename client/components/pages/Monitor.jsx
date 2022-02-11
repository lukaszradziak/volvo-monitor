import { useEffect, useState } from "react";
import { useInterval } from "react-use";
import Button from "../elements/Button";
import useParameters from "../../hooks/useParameters";
import useSettings from "../../hooks/useSettings";
import Api from "../../utils/Api";

const Monitor = () => {
  const [settings] = useSettings();
  const [parameters] = useParameters();

  const [data, setData] = useState("");
  const [parameterValues, setParameterValues] = useState({});

  const [started, setStarted] = useState(false);
  const [blockInterval, setBlockInterval] = useState(false);

  const fetchStart = async () => {
    const values = Object.fromEntries(
      parameters
        .filter((parameter) => parameter.active)
        .map((parameter, index) => {
          return [`param${index}`, parseInt(parameter.address, 16)];
        })
    );

    await Api(`monitor/start`, {
      canSpeed: settings.canSpeed,
      canAddress: parseInt(settings.canAddress, 16),
      canInterval: parseInt(settings.canInterval),
      ...values,
    });
  };

  const fetchStop = async () => {
    await Api(`monitor/stop`, {});
  };

  const fetchData = async () => {
    return await Api(`data`);
  };

  const parseData = (data) => {
    const result = {};
    data
      .split("\n")
      .filter((d) => d)
      .forEach((line) => {
        const col = line.split(`,`);
        result[col[5] + col[6]] = [col[0], col[7], col[8], col[9]];
      });

    setParameterValues((old) => {
      return {
        ...old,
        ...result,
      };
    });
  };

  useInterval(
    async () => {
      setBlockInterval(true);

      if (settings.canInterval === "01") {
        await fetchStart();
      }

      const data = await fetchData();
      parseData(data);
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
      {parameters
        .filter((paramter) => paramter.active)
        .map((paramter, index) => (
          <div
            key={index}
            className="mb-6 bg-white shadow overflow-hidden sm:rounded-lg border p-2 flex justify-between"
          >
            <div>
              {paramter.name} ({paramter.address})
            </div>
            <div>
              {parameterValues[paramter.address]
                ? parameterValues[paramter.address][0]
                : null}
            </div>
            <div>
              {parameterValues[paramter.address]
                ? String(parameterValues[paramter.address][1]) +
                  " " +
                  String(parameterValues[paramter.address][2]) +
                  " " +
                  String(parameterValues[paramter.address][3])
                : null}
            </div>
          </div>
        ))}
      <pre>{JSON.stringify(parameterValues, " ", 2)}</pre>
      <pre>{data}</pre>
    </>
  );
};

export default Monitor;
