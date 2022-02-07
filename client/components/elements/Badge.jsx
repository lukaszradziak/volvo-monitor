const Badge = ({ type = `info`, children }) => {
  const colors = {
    success: {
      bg: `bg-green-100`,
      text: `text-green-800`,
    },
    error: {
      bg: `bg-red-100`,
      text: `text-red-800`,
    },
    info: {
      bg: `bg-blue-100`,
      text: `text-blue-800`,
    },
    warning: {
      bg: `bg-yellow-100`,
      text: `text-yellow-800`,
    },
  };
  const color = colors[type];

  return (
    <span
      className={`mr-2 mb-2 inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium ${color.bg} ${color.text}`}
    >
      {children}
    </span>
  );
};

export default Badge;
