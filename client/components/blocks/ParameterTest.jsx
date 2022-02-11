import Alert from "../elements/Alert";
import Badge from "../elements/Badge";
import Header from "../elements/Header";

const ParameterTest = ({ data }) => {
  const badgeType = (index) => {
    if (index === 1) {
      return "error";
    } else if (index === 2) {
      return "info";
    } else if (index === 5 || index === 6) {
      return "info";
    } else if (index === 7 || index === 8 || index === 9) {
      return "success";
    } else {
      return "warning";
    }
  };

  return (
    <div>
      {data.data?.length ? (
        <div className="pt-2">
          {data.parse.success ? (
            <Alert title="Success" type="success" />
          ) : (
            <Alert title="Error response" type="error" />
          )}
          <Header>
            {data.parameter.name} ({data.parameter.address})
          </Header>
          <p>{data.parameter.description}</p>
          <div className="py-4">
            {data.data.map((hex, index) => (
              <Badge key={index} type={badgeType(index)}>
                {hex}
              </Badge>
            ))}
          </div>
          <Header>Parse</Header>
          <div>
            <Badge>HEX: {data.parse.hex}</Badge>
          </div>
          <div>
            <Badge>Value: {data.parse.value}</Badge>
          </div>
          <div>
            <Badge type="success">
              <span className="font-bold text-xl">{data.parse.calc}</span>
            </Badge>
          </div>
        </div>
      ) : (
        <Alert title="Connecting..." type="info" />
      )}
    </div>
  );
};
export default ParameterTest;
