import Button from "../elements/Button";
import {
  MinusCircleIcon,
  PencilAltIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/outline";

const Parameter = ({
  data,
  onToggleActive = () => {},
  onEdit = () => {},
  onRemove = () => {},
}) => {
  return (
    <>
      <div
        className={` mb-6 bg-white shadow overflow-hidden sm:rounded-lg border ${
          data.active ? `border-2 border-primary-400` : ``
        }`}
      >
        <div className="px-4 py-4 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {data.name}
            </h3>
          </div>
          <div className="flex items-center">
            <Button
              onClick={onToggleActive}
              color={data.active ? `default` : `primary`}
            >
              {data.active ? (
                <MinusCircleIcon className="h-4 w-4" />
              ) : (
                <PlusCircleIcon className="h-4 w-4" />
              )}
            </Button>
            <Button onClick={onEdit}>
              <PencilAltIcon className="h-4 w-4" />
            </Button>
            <Button onClick={onRemove}>
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          {data.description ? <p className="mb-4">{data.description}</p> : null}
          <span className="mr-2 inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-green-100 text-green-800">
            {data.address}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-yellow-100 text-yellow-800">
            {data.pattern || `-`}
          </span>
        </div>
      </div>
    </>
  );
};

export default Parameter;
