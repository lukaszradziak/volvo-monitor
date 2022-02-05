import { useState } from "react";

import useParameters from "../hooks/useParameters";

import Parameter from "../blocks/Parameter";
import ParameterForm from "../blocks/ParameterForm";
import Button from "../elements/Button";
import Modal from "../elements/Modal";

import sampleData from "../../data/sample.json";
import Paginator from "../blocks/Paginator";
import Label from "../elements/Label";
import Input from "../elements/Input";
import Header from "../elements/Header";
import Select from "../elements/Select";

const Parameters = () => {
  const [parameters, setParameters] = useParameters();

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [search, setSearch] = useState("");
  const [searchUnit, setSearchUnit] = useState("");
  const [searchActive, setSearchActive] = useState(null);

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

  const loadSample = () => {
    const data = sampleData.map((row) => ({
      address: row.address,
      name: row.name,
      description: row.description,
      size: row.size,
      definition: row.definition,
      unit: row.unit,
      min: row.min,
      max: row.max,
      active: false,
    }));
    setParameters(data);
  };

  const filter = (data) => {
    let filterData = data.map((item, index) => {
      return { item, index };
    });

    if (search) {
      filterData = filterData.filter(({ item }) => {
        return (
          String(item.name).toLowerCase().indexOf(search) !== -1 ||
          String(item.description).toLowerCase().indexOf(search) !== -1 ||
          String(item.address).toLowerCase().indexOf(search) !== -1
        );
      });
    }
    if (searchUnit) {
      filterData = filterData.filter(({ item }) => {
        return item.unit === searchUnit;
      });
    }

    if (searchActive) {
      filterData = filterData.filter(({ item }) => {
        if (searchActive === "1") {
          return item.active;
        } else {
          return !item.active;
        }
      });
    }

    return filterData;
  };

  return (
    <div>
      <div className="mb-4">
        <Button color="primary" onClick={() => setOpenCreate(true)}>
          Create
        </Button>
        <Button onClick={loadSample}>Load Sample</Button>
        <Button>Upload</Button>
        <Button>Download</Button>
      </div>

      <div className="mb-4">
        <Label>Search</Label>
        <div className="mt-1">
          <Input
            placeholder="Search..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div>
          <Label>Active</Label>
          <div className="mt-1">
            <Select
              options={[
                { label: "All", value: "" },
                { label: "Active", value: "1" },
                { label: "Inactive", value: "0" },
              ]}
              onChange={(e) => setSearchActive(e.target.value)}
            />
          </div>
        </div>
        <div>
          <Label>Unit</Label>
          <div className="mt-1">
            <Select
              options={[...new Set(parameters.map((p) => p.unit))].map(
                (name) => ({ label: name || "All", value: name })
              )}
              onChange={(e) => setSearchUnit(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mb-2">
        <Header>Parameters</Header>
      </div>

      <Paginator
        scrollable={true}
        items={filter(parameters)}
        render={({ item, index }) => {
          return (
            <>
              <Parameter
                key={index}
                data={item}
                onToggleActive={() => toggleActive(index)}
                onEdit={() => edit(index)}
                onRemove={() => remove(index)}
              />
            </>
          );
        }}
      />

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
