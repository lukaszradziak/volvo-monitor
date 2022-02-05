import Button from "../elements/Button";
import { PencilAltIcon, StarIcon, TrashIcon } from "@heroicons/react/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/solid";

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
              {data.name} ({data.address})
            </h3>
          </div>
          <div className="flex items-center">
            <Button
              onClick={onToggleActive}
              color={data.active ? `default` : `primary`}
            >
              {data.active ? (
                <StarIcon className="h-4 w-4" />
              ) : (
                <StarIconSolid className="h-4 w-4" />
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

          <span className="mr-2 inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-yellow-100 text-yellow-800">
            {data.definition || `-`}
          </span>
          <span className="mr-2 inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
            {data.unit || `-`}
          </span>

          <span className="mr-2 inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-green-100 text-green-800">
            {data.max ? `${data.min} / ${data.max}` : "-"}
          </span>
        </div>
      </div>
    </>
  );
};

export default Parameter;
