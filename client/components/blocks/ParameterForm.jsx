import { Controller, useForm } from "react-hook-form";
import Alert from "../elements/Alert";
import Button from "../elements/Button";
import Checkbox from "../elements/Checkbox";
import Input from "../elements/Input";
import Label from "../elements/Label";
import Select from "../elements/Select";
import Textarea from "../elements/Textarea";

const ParameterForm = ({ onSubmit }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: ``,
      name: ``,
      description: ``,
      address: ``,
      active: false,
      type: ``,
      pattern: ``,
    },
  });

  const submit = (data) => {
    onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="mb-4">
      {Object.keys(errors).length ? (
        <Alert type="error" title="Fill required fields" />
      ) : null}
      <Label required>ID</Label>
      <Controller
        name="id"
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input {...{ onChange, onBlur, value }} />
        )}
      />
      <Label required>Name</Label>
      <Controller
        name="name"
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input {...{ onChange, onBlur, value }} />
        )}
      />
      <Label required>Address</Label>
      <Controller
        name="address"
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input {...{ onChange, onBlur, value }} />
        )}
      />
      <Label>Description</Label>
      <Controller
        name="description"
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Textarea {...{ onChange, onBlur, value }} />
        )}
      />
      <Label>Active</Label>
      <Controller
        name="active"
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Checkbox {...{ onChange, onBlur, value }} />
        )}
      />
      <Label required>Type</Label>
      <Controller
        name="type"
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Select
            {...{ onChange, onBlur, value }}
            options={[
              { value: "1", label: "Multiple" },
              { value: "2", label: "First byte" },
              { value: "3", label: "Second byte" },
            ]}
          />
        )}
      />
      <Label>Pattern</Label>
      <Controller
        name="pattern"
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input {...{ onChange, onBlur, value }} />
        )}
      />
      <Button type="submit">Create</Button>
    </form>
  );
};

export default ParameterForm;
