import { Controller, useForm } from "react-hook-form";
import Alert from "../elements/Alert";
import Button from "../elements/Button";
import Input from "../elements/Input";
import Label from "../elements/Label";

const SnifferMessage = ({ onSubmit = () => {} }) => {
  const dataIds = [...new Array(8)].map((value, index) => index);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      address: `0FFFFE`,
      ...Object.fromEntries(dataIds.map((id) => [`data${id}`, "00"])),
    },
  });

  const submit = (data) => {
    const post = Object.fromEntries(
      Object.keys(data).map((key) => {
        return [key, parseInt(data[key], 16)];
      })
    );
    onSubmit(post);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="mb-4">
      {Object.keys(errors).length ? (
        <Alert type="error" title="Fill required fields" />
      ) : null}

      <Label required>Address</Label>
      <Controller
        name="address"
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input {...{ onChange, onBlur, value }} />
        )}
      />
      <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
        {dataIds.map((id) => (
          <div key={id}>
            <Label required>Data {id}</Label>
            <Controller
              name={`data${id}`}
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input {...{ onChange, onBlur, value }} />
              )}
            />
          </div>
        ))}
      </div>
      <Button type="submit">Send</Button>
    </form>
  );
};

export default SnifferMessage;
