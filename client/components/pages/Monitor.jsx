import { useEffect, useState } from "react";
import { useInterval } from "react-use";

import useParameters from "../../hooks/useParameters";
import useSettings from "../../hooks/useSettings";
import Api from "../../utils/Api";
import DownloadFile from "../../utils/DownloadFile";
import ParseFrame from "../../utils/ParseFrame";
import Badge from "../elements/Badge";

import Button from "../elements/Button";
import Header from "../elements/Header";

const Monitor = () => {
  const [settings] = useSettings();
  const [parameters] = useParameters();

  const [data, setData] = useState([]);
  const [actualData, setActualData] = useState([]);

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

  const activeParameters = () => {
    return parameters.filter((paramter) => paramter.active);
  };

  const parseFrames = (frames) => {
    const parameters = activeParameters();
    if (actualData.length !== parameters.length) {
      parameters.forEach((parameter, index) => {
        actualData[index] = 0;
      });
    }

    frames.split(`\n`).forEach((line) => {
      const frame = line.split(`,`);
      const address = frame[5] + frame[6];
      const time = frame[0];

      const parameterIndex = parameters.findIndex(
        (parameter) => parameter.address == address
      );
      const parameter = parameters[parameterIndex];

      if (parameterIndex === -1) {
        return;
      }

      const parse = ParseFrame(frame, parameter);
      actualData[parameterIndex] = parse.calc;

      data.push({ time, actual: [...actualData] });
    });
    setActualData(actualData);
    setData(data);
  };

  useInterval(
    async () => {
      setBlockInterval(true);

      if (settings.canInterval === "01") {
        await fetchStart();
      }

      const data = await fetchData();
      parseFrames(data);

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

  const clear = () => {
    setData([]);
    setActualData([]);
  };

  const download = () => {
    let header = `TIME,${activeParameters()
      .map((p, index) => p.name || `p${index}`)
      .join(`,`)}\n`;

    const content =
      header +
      data
        .map((line) => {
          const time = (line.time - data[0].time) / 1000;
          return `${time},${line.actual.join(`,`)}`;
        })
        .join(`\n`);

    DownloadFile(content, `logger.csv`, `text/csv`);
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
        <Button onClick={() => clear()}>Clear</Button>
        <Button onClick={() => download()}>Download</Button>
      </div>
      <p className="mb-2">Length: {data.length}</p>
      {activeParameters().map((paramter, index) => (
        <div
          key={index}
          className="mb-2 bg-white shadow overflow-hidden sm:rounded-lg border p-2 flex justify-between items-center"
        >
          <div>
            <Header>
              {paramter.name} ({paramter.address})
            </Header>
            <p>
              {paramter.description.slice(0, 15)}{" "}
              {paramter.description.length >= 15 ? `...` : null}
            </p>
          </div>
          <div className="flex flex-col">
            <div className="flex justify-end">
              <Badge>
                <span className="text-2xl">
                  {parseFloat(actualData[index] || 0).toFixed(2)}
                </span>
              </Badge>
            </div>
            <div className="flex justify-end">
              <Badge type="success">
                <span className="text-xs">0</span>
              </Badge>{" "}
              <Badge type="error">
                <span className="text-xs">0</span>
              </Badge>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Monitor;
