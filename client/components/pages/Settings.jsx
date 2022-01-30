import { useForm, Controller } from "react-hook-form";
import Button from "../elements/Button";
import Input from "../elements/Input";
import Label from "../elements/Label";
import Select from "../elements/Select";

const Settings = () => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      interval: "100",
      canSpeed: "250",
    },
  });
  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Label>Requests Interval</Label>
      <Controller
        name="interval"
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input {...{ onChange, onBlur, value }} />
        )}
      />
      <Label>CAN Speed</Label>
      <Controller
        name="canSpeed"
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Select
            {...{ onChange, onBlur, value }}
            options={[
              { value: "250", label: "250 kbps" },
              { value: "500", label: "500 kbps (MY05+)" },
            ]}
          />
        )}
      />
      <Button type="submit">Save</Button>
    </form>
  );
};

export default Settings;
