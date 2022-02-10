import { useEffect, useState } from "react";
import { useInterval } from "react-use";
import Button from "../elements/Button";
import useSettings from "../../hooks/useSettings";
import { Api } from "../../utils/Api";
import Header from "../elements/Header";
import Label from "../elements/Label";
import Input from "../elements/Input";
import { Controller, useForm } from "react-hook-form";

const Monitor = () => {
  const { control, getValues } = useForm({
    defaultValues: {
      limitFrames: 10,
    },
  });

  const [settings] = useSettings();

  const [started, setStarted] = useState(false);
  const [blockInterval, setBlockInterval] = useState(false);

  const [limitFrames, setLimitFrames] = useState([]);

  const fetchStart = async () => {
    await Api(`sniffer/start`, {
      canSpeed: settings.canSpeed,
    });
  };

  const fetchStop = async () => {
    await Api(`sniffer/stop`, {});
  };

  const fetchData = async () => {
    return await Api(`data`);
  };

  const parseFrames = (data) => {
    return data
      .trim()
      .split(`\n`)
      .filter((f) => f)
      .map((frame) => {
        return frame.split(",");
      });
  };

  const softFilter = (data) => {
    const softFilterId = getValues("softFilterId");
    if (softFilterId) {
      return parseInt(softFilterId, 16) === parseInt(data[1], 16);
    }
    return true;
  };

  useInterval(
    async () => {
      setBlockInterval(true);

      const data = await fetchData();
      const parse = parseFrames(data);

      const maxFrames = parseInt(getValues("limitFrames")) || 1;
      setLimitFrames((old) =>
        [...old, ...parse].filter(softFilter).slice(-maxFrames)
      );

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
        <Label>Limit frames</Label>
        <Controller
          name="limitFrames"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input {...{ onChange, onBlur, value }} />
          )}
        />
        <Button onClick={() => start()} color={started ? null : `primary`}>
          Start
        </Button>
        <Button onClick={() => stop()} color={started ? `primary` : null}>
          Stop
        </Button>
      </div>
      <div>
        <Header>Sniffer</Header>
        <div>
          {limitFrames.map((frame, index) => (
            <div key={index}>{JSON.stringify(frame)}</div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Monitor;
