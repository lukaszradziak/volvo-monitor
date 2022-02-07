import Button from "../elements/Button";
import { PencilAltIcon, StarIcon, TrashIcon } from "@heroicons/react/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/solid";
import Badge from "../elements/Badge";

const Parameter = ({
  data,
  onToggleActive = () => {},
  onEdit = () => {},
  onRemove = () => {},
  onTest = () => {},
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
              color={data.active ? `primary` : `default`}
            >
              {data.active ? (
                <StarIconSolid className="h-4 w-4" />
              ) : (
                <StarIcon className="h-4 w-4" />
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

          <Badge>{data.definition || `-`}</Badge>
          <Badge type="error">{data.unit || `-`}</Badge>

          <Badge type="success">{data.size}</Badge>

          <Badge type="warning">
            {data.max ? `${data.min} / ${data.max}` : "-"}
          </Badge>

          <button
            className="mr-2 inline-flex justify-center py-1 px-4 border border-transparent shadow-sm text-xs font-medium rounded-md bg-gray-100"
            onClick={() => onTest(data)}
          >
            Test
          </button>
        </div>
      </div>
    </>
  );
};

export default Parameter;
