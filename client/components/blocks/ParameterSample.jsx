import Button from "../elements/Button";

const files = import.meta.glob("../../data/*.csv");

const basename = (path) => {
  return path.split("/").reverse()[0];
};

const ParameterSample = ({ onLoad }) => {
  const download = async (path) => {
    const data = await files[path]();
    const result = data.default.map((row) => {
      return {
        address: row[0],
        name: row[1],
        description: row[2],
        size: row[3],
        definition: row[4],
        unit: row[5],
        min: String(parseFloat(row[6])),
        max: String(parseFloat(row[7])),
        active: false,
      };
    });

    onLoad(result);
  };

  return (
    <div className="flex flex-col">
      {Object.keys(files).map((path, index) => (
        <Button key={index} onClick={() => download(path)}>
          {basename(path)}
        </Button>
      ))}
    </div>
  );
};
export default ParameterSample;
