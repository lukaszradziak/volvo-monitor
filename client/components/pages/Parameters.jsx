import Parameter from "../blocks/Parameter";
import ParameterForm from "../blocks/ParameterForm";
import Button from "../elements/Button";
import useParameters from "../hooks/useParameters";
import Modal from "../elements/Modal";
import { useState } from "react";

const Parameters = () => {
  const [parameters, setParameters] = useParameters();
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const submitCreate = (data) => {
    setParameters([...parameters, data]);
    setOpenCreate(false);
  };

  const toggleActive = (index) => {
    parameters[index].active = !parameters[index].active;
    setParameters(parameters);
  };

  const edit = (index) => {
    setOpenEdit(true);
    setEditIndex(index);
  };

  const submitEdit = (data) => {
    parameters[editIndex] = data;
    setParameters(parameters);
    setOpenEdit(false);
    setEditIndex(null);
  };

  const remove = (index) => {
    parameters.splice(index, 1);
    setParameters(parameters);
  };

  return (
    <div>
      <div className="mb-4">
        <Button color="primary" onClick={() => setOpenCreate(true)}>
          Create
        </Button>
        <Button>Load Sample</Button>
        <Button>Upload</Button>
        <Button>Download</Button>
      </div>

      {parameters && parameters.length ? (
        <div>
          {parameters.map((parameter, index) => (
            <Parameter
              key={index}
              data={parameter}
              onToggleActive={() => toggleActive(index)}
              onEdit={() => edit(index)}
              onRemove={() => remove(index)}
            />
          ))}
        </div>
      ) : (
        <p>Empty</p>
      )}

      <Modal open={openCreate} onClose={() => setOpenCreate(false)}>
        <ParameterForm onSubmit={submitCreate} />
      </Modal>

      <Modal open={openEdit} onClose={() => setOpenEdit(false)}>
        <ParameterForm onSubmit={submitEdit} editData={parameters[editIndex]} />
      </Modal>
    </div>
  );
};

export default Parameters;
