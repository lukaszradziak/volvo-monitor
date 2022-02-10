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
  const { control, watch, getValues } = useForm({
    defaultValues: {
      limitFrames: 10,
      filterACR0: `0`,
      filterACR1: `0`,
      filterACR2: `0`,
      filterACR3: `0`,
      filterAMR0: `ff`,
      filterAMR1: `ff`,
      filterAMR2: `ff`,
      filterAMR3: `ff`,
    },
  });

  const [settings] = useSettings();

  const [started, setStarted] = useState(false);
  const [blockInterval, setBlockInterval] = useState(false);

  const [limitFrames, setLimitFrames] = useState([]);

  const fetchStart = async () => {
    await Api(`sniffer/start`, {
      canSpeed: settings.canSpeed,
      filterACR0: parseInt(getValues(`filterACR0`), 16),
      filterACR1: parseInt(getValues(`filterACR1`), 16),
      filterACR2: parseInt(getValues(`filterACR2`), 16),
      filterACR3: parseInt(getValues(`filterACR3`), 16),
      filterAMR0: parseInt(getValues(`filterAMR0`), 16),
      filterAMR1: parseInt(getValues(`filterAMR1`), 16),
      filterAMR2: parseInt(getValues(`filterAMR2`), 16),
      filterAMR3: parseInt(getValues(`filterAMR3`), 16),
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

  useEffect(() => {
    const subscription = watch(async (value, { name, type }) => {
      setBlockInterval(true);
      await start();
      setBlockInterval(false);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

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
        <Label>Hardware Filter</Label>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mt-2">
          <div>
            <Label>ACR0</Label>
            <Controller
              name="filterACR0"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input {...{ onChange, onBlur, value }} />
              )}
            />
          </div>
          <div>
            <Label>ACR1</Label>
            <Controller
              name="filterACR1"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input {...{ onChange, onBlur, value }} />
              )}
            />
          </div>
          <div>
            <Label>ACR2</Label>
            <Controller
              name="filterACR2"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input {...{ onChange, onBlur, value }} />
              )}
            />
          </div>
          <div>
            <Label>ACR3</Label>
            <Controller
              name="filterACR3"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input {...{ onChange, onBlur, value }} />
              )}
            />
          </div>
          <div>
            <Label>AMR0</Label>
            <Controller
              name="filterAMR0"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input {...{ onChange, onBlur, value }} />
              )}
            />
          </div>
          <div>
            <Label>AMR1</Label>
            <Controller
              name="filterAMR1"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input {...{ onChange, onBlur, value }} />
              )}
            />
          </div>
          <div>
            <Label>AMR2</Label>
            <Controller
              name="filterAMR2"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input {...{ onChange, onBlur, value }} />
              )}
            />
          </div>
          <div>
            <Label>AMR3</Label>
            <Controller
              name="filterAMR3"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input {...{ onChange, onBlur, value }} />
              )}
            />
          </div>
        </div>
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
