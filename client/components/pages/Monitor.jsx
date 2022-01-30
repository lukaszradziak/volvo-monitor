import { useEffect, useState } from "react";

const Monitor = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    let timer;

    const loop = async () => {
      let request = await fetch(`http://192.168.4.1/api/monitor-data`);
      let text = await request.text();
      let lines = text
        .trim()
        .split("\n")
        .filter((line) => line);

      lines.forEach((line) => {
        let values = line.split(";");
        setData((data) => [...data, values]);
      });

      timer = setTimeout(loop, 100);
    };
    loop();

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div>
      <p>Monitor Page {data.length}</p>
      {data.length ? <p>Data: {data[data.length - 1][0]}</p> : null}
    </div>
  );
};

export default Monitor;
