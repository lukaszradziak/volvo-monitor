import { useEffect, useState } from "react";
import { useInterval } from "react-use";
import { Controller, useForm } from "react-hook-form";

import useSettings from "../../hooks/useSettings";
import Api from "../../utils/Api";
import DownloadFile from "../../utils/DownloadFile";

import Button from "../elements/Button";
import Header from "../elements/Header";
import Label from "../elements/Label";
import Input from "../elements/Input";
import SnifferMessage from "../blocks/SnifferMessage";

const Monitor = () => {
  const { control, getValues } = useForm({
    defaultValues: {
      limitFrames: `0`,
      filterACR0: `0`,
      filterACR1: `0`,
      filterACR2: `0`,
      filterACR3: `0`,
      filterAMR0: `ff`,
      filterAMR1: `ff`,
      filterAMR2: `ff`,
      filterAMR3: `ff`,
      softFilterId: ``,
    },
  });

  const [settings] = useSettings();

  const [started, setStarted] = useState(false);
  const [blockInterval, setBlockInterval] = useState(false);

  const [data, setData] = useState([]);

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

  const limitFrames = () => {
    const limit = parseInt(getValues("limitFrames") || "0");
    return isNaN(limit) ? 1 : limit;
  };

  useInterval(
    async () => {
      setBlockInterval(true);

      const data = await fetchData();
      const parse = parseFrames(data);
      setData((old) => [...old, ...parse]);

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
  };

  const download = () => {
    const content = data
      .map((line) => {
        return line.join(`,`);
      })
      .join(`\n`);

    DownloadFile(content, `sniffer.csv`, `text/csv`);
  };

  const submitMessage = async (post) => {
    if (!started) {
      await start();
    }

    setStarted(false);

    await Api(`sniffer/message`, post);

    setStarted(true);
  };

  const dataFilter = (data) => {
    if (getValues(`softFilterId`)) {
      return data[1].search(getValues(`softFilterId`)) !== -1;
    }
    return true;
  };

  return (
    <>
      <div>
        <Header>Settings</Header>
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
        <Label>Soft Filter ID</Label>
        <Controller
          name="softFilterId"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input {...{ onChange, onBlur, value }} />
          )}
        />
        <Header>Send Message</Header>
        <SnifferMessage onSubmit={submitMessage} />
        <Button onClick={() => start()} color={started ? null : `primary`}>
          Start
        </Button>
        <Button onClick={() => stop()} color={started ? `primary` : null}>
          Stop
        </Button>
        <Button onClick={() => clear()}>Clear</Button>
        <Button onClick={() => download()}>Download CSV</Button>
      </div>
      <div>
        <Header>Sniffer ({data.length})</Header>
        <div>
          {data
            .filter(dataFilter)
            .slice(-limitFrames())
            .map((frame, index) => (
              <div key={index}>{JSON.stringify(frame)}</div>
            ))}
        </div>
      </div>
    </>
  );
};

export default Monitor;
