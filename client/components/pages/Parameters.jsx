import { useEffect, useState } from "react";

import useParameters from "../../hooks/useParameters";

import Parameter from "../blocks/Parameter";
import ParameterForm from "../blocks/ParameterForm";
import Button from "../elements/Button";
import Modal from "../elements/Modal";

import Paginator from "../blocks/Paginator";
import Label from "../elements/Label";
import Input from "../elements/Input";
import Header from "../elements/Header";
import Select from "../elements/Select";
import Dropdown from "../elements/Dropdown";
import ParameterSample from "../blocks/ParameterSample";
import useSettings from "../../hooks/useSettings";
import ParameterTest from "../blocks/ParameterTest";
import Api from "../../utils/Api";
import ParseFrame from "../../utils/ParseFrame";

const Parameters = () => {
  const [settings] = useSettings();

  const [parameters, setParameters] = useParameters();
  const [filterParameters, setFilterParameters] = useState([]);

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [openSample, setOpenSample] = useState(false);
  const [openTest, setOpenTest] = useState(false);
  const [testData, setTestData] = useState({});

  const [search, setSearch] = useState("");
  const [searchUnit, setSearchUnit] = useState("");
  const [searchActive, setSearchActive] = useState(null);

  useEffect(() => {
    let filterParameters = parameters.map((item, index) => {
      return { item, index };
    });

    if (search) {
      const toSearch = search.toLowerCase();

      filterParameters = filterParameters.filter(({ item }) => {
        return (
          String(item.name).toLowerCase().indexOf(toSearch) !== -1 ||
          String(item.description).toLowerCase().indexOf(toSearch) !== -1 ||
          String(item.address).toLowerCase().indexOf(toSearch) !== -1
        );
      });
    }
    if (searchUnit) {
      filterParameters = filterParameters.filter(({ item }) => {
        return item.unit === searchUnit;
      });
    }

    if (searchActive) {
      filterParameters = filterParameters.filter(({ item }) => {
        if (searchActive === "1") {
          return item.active;
        } else {
          return !item.active;
        }
      });
    }

    setFilterParameters(filterParameters);
  }, [parameters, search, searchUnit, searchActive]);

  const loadSample = (data) => {
    setParameters(data);
    setOpenSample(false);
  };

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

  const test = async (data) => {
    setTestData({});

    const text = await Api(`monitor/test`, {
      canSpeed: settings.canSpeed,
      canAddress: parseInt(settings.canAddress, 16),
      address: parseInt(data.address, 16),
    });

    const frame = text.split(",").filter((d) => d);
    const parse = ParseFrame(frame, data);

    setOpenTest(true);
    setTestData({
      parameter: data,
      data: frame,
      parse,
    });
  };

  return (
    <div>
      <div className="mb-4 flex justify-between">
        <Button color="primary" onClick={() => setOpenCreate(true)}>
          Create
        </Button>
        <Dropdown
          options={[
            {
              label: `Upload`,
              onClick: () => console.log(`Upload`),
            },
            {
              label: `Download`,
              onClick: () => console.log(`Download`),
            },
            {
              label: `Load Sample`,
              onClick: () => setOpenSample(true),
            },
          ]}
        />
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
                { label: `All`, value: "" },
                {
                  label: `Active (${
                    parameters.filter((p) => p.active).length
                  })`,
                  value: "1",
                },
                {
                  label: `Inactive (${
                    parameters.filter((p) => !p.active).length
                  })`,
                  value: "0",
                },
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
        <Header>Parameters ({filterParameters.length})</Header>
      </div>

      <Paginator
        scrollable={true}
        items={filterParameters}
        render={({ item, index }) => {
          return (
            <>
              <Parameter
                key={index}
                data={item}
                onToggleActive={() => toggleActive(index)}
                onEdit={() => edit(index)}
                onRemove={() => remove(index)}
                onTest={() => test(item)}
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

      <Modal open={openSample} onClose={() => setOpenSample(false)}>
        <ParameterSample onLoad={loadSample} />
      </Modal>

      <Modal open={openTest} onClose={() => setOpenTest(false)}>
        <Button onClick={() => test(testData.parameter)}>Reload</Button>

        <ParameterTest data={testData} />
      </Modal>
    </div>
  );
};

export default Parameters;
