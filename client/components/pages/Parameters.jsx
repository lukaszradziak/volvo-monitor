import Parameter from "../blocks/Parameter";
import ParameterForm from "../blocks/ParameterForm";
import Button from "../elements/Button";
import useParameters from "../hooks/useParameters";

const Parameters = () => {
  const [parameters, setParameters] = useParameters();

  const handleSubmit = (data) => {
    setParameters([...parameters, data]);
  };

  return (
    <div>
      <div className="mb-4">
        <Button color="primary">Create</Button>
        <Button>Load Sample</Button>
        <Button>Upload CSV</Button>
        <Button>Download CSV</Button>
      </div>

      <ParameterForm onSubmit={handleSubmit} />

      {parameters ? (
        <div>
          {parameters.map((parameter, index) => (
            <Parameter key={index} data={parameter} />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default Parameters;
