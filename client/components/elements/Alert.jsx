import { InformationCircleIcon } from "@heroicons/react/solid";

const Alert = ({ type = `info`, title, message }) => {
  const colors = {
    info: {
      bg: `bg-blue-50`,
      text: `text-blue-800`,
      border: `border-blue-100`,
    },
    error: {
      bg: `bg-red-50`,
      text: `text-red-800`,
      border: `border-red-100`,
    },
    success: {
      bg: `bg-green-50`,
      text: `text-green-800`,
      border: `border-green-100`,
    },
  };
  const color = colors[type];

  return (
    <div className={`rounded-md ${color.bg} p-4 border ${color.border} mb-4`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <InformationCircleIcon
            className={`h-5 w-5 ${color.text}`}
            aria-hidden="true"
          />
        </div>
        <div className="flex items-center ml-3">
          <h3 className={`text-sm font-medium ${color.text}`}>{title}</h3>
          <div className={`mt-2 text-sm ${color.text}`}>{message}</div>
        </div>
      </div>
    </div>
  );
};

export default Alert;
