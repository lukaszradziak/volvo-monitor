import { Controller, useForm } from "react-hook-form";
import Alert from "../elements/Alert";
import Button from "../elements/Button";
import Checkbox from "../elements/Checkbox";
import Input from "../elements/Input";
import Label from "../elements/Label";
import Select from "../elements/Select";
import Textarea from "../elements/Textarea";

const ParameterForm = ({ onSubmit, editData = null }) => {
  const defaultValues = editData
    ? editData
    : {
        address: ``,
        name: ``,
        description: ``,
        size: `8`,
        definition: ``,
        unit: ``,
        min: ``,
        max: ``,
        active: false,
      };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  const submit = (data) => {
    onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="mb-4">
      {editData ? <h2>Edit</h2> : null}
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
      <Label>Name</Label>
      <Controller
        name="name"
        control={control}
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
      <Label required>Size</Label>
      <Controller
        name="size"
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Select
            {...{ onChange, onBlur, value }}
            options={[
              { value: "8", label: "8" },
              { value: "16", label: "16" },
            ]}
          />
        )}
      />
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label>Definition</Label>
          <Controller
            name="definition"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input {...{ onChange, onBlur, value }} />
            )}
          />
        </div>
        <div>
          <Label>Unit</Label>
          <Controller
            name="unit"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input {...{ onChange, onBlur, value }} />
            )}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label>Minimum</Label>
          <Controller
            name="min"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input {...{ onChange, onBlur, value }} />
            )}
          />
        </div>
        <div>
          <Label>Maximum</Label>
          <Controller
            name="max"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input {...{ onChange, onBlur, value }} />
            )}
          />
        </div>
      </div>
      <Label>Active</Label>
      <Controller
        name="active"
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Checkbox {...{ onChange, onBlur }} checked={value} />
        )}
      />

      <Button type="submit">{editData ? `Update` : `Create`}</Button>
    </form>
  );
};

export default ParameterForm;
