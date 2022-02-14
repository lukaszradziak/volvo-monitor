import { useState } from "react";
import useSettings from "../../hooks/useSettings";
import Api from "../../utils/Api";
import Alert from "../elements/Alert";
import Badge from "../elements/Badge";
import Button from "../elements/Button";
import Header from "../elements/Header";
import Modal from "../elements/Modal";

const unitNames = {
  40: "CEM",
  50: "CEM",
  "7A": "ECM",
};

const Home = () => {
  const [settings] = useSettings();
  const [modalOpen, setModalOpen] = useState(false);
  const [codes, setCodes] = useState([]);
  const [status, setStatus] = useState("");

  const read = async () => {
    setStatus("Loading...");
    setCodes([]);
    setModalOpen(true);

    const data = await Api(`dtc/read`, {
      canSpeed: settings.canSpeed,
      canAddress: parseInt(settings.canAddress, 16),
    });

    setStatus("");

    const codes = data
      .match(/EE\,1B\,(.*?),(.*?)\,00/g)
      .map((code) => code.replace(`EE,1B,`, "").split(","))
      .map((code) => code[0] + code[1]);

    setCodes(codes);
  };

  const clear = async () => {
    setStatus("Loading...");
    setCodes([]);
    setModalOpen(true);

    const data = await Api(`dtc/clear`, {
      canSpeed: settings.canSpeed,
      canAddress: parseInt(settings.canAddress, 16),
    });

    if (data === `ok`) {
      setStatus("Success");
    }
  };

  const dtcName = (code) => {
    const name = unitNames[settings.canAddress] || "";
    return (name ? `${name}-` : ``) + code;
  };

  return (
    <>
      <Header>Volvo Monitor</Header>
      <div className="py-4">
        <Button onClick={read}>Read DTC ({settings.canAddress})</Button>
        <Button onClick={clear}>Clear DTC ({settings.canAddress})</Button>
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(!modalOpen)}>
        {status ? <Alert title={status} type="info" /> : null}
        {codes.map((code, index) => (
          <div key={index}>
            <Badge type="error">
              <a
                href={`https://www.dtcdecode.com/Volvo/${dtcName(code)}`}
                target="_blank"
              >
                {dtcName(code)}
              </a>
            </Badge>
          </div>
        ))}
      </Modal>
    </>
  );
};

export default Home;
