import { useForm, Controller } from "react-hook-form";
import Button from "../elements/Button";
import Input from "../elements/Input";
import Label from "../elements/Label";
import Select from "../elements/Select";
import useSettings from "../hooks/useSettings";

const Settings = () => {
  const [settings, setSettings] = useSettings();
  const { control, handleSubmit } = useForm({
    defaultValues: settings,
  });
  const onSubmit = (data) => {
    setSettings(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Label required>Monitor Interval</Label>
      <Controller
        name="interval"
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input {...{ onChange, onBlur, value }} />
        )}
      />
      <Label required>CAN Speed</Label>
      <Controller
        name="canSpeed"
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Select
            {...{ onChange, onBlur, value }}
            options={[
              { value: "125", label: "125 kbps" },
              { value: "250", label: "250 kbps" },
              { value: "500", label: "500 kbps" },
            ]}
          />
        )}
      />
      <Label required>CAN Address</Label>
      <Controller
        name="canAddress"
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input {...{ onChange, onBlur, value }} />
        )}
      />
      <Button type="submit" color="primary">
        Save
      </Button>
    </form>
  );
};

export default Settings;
