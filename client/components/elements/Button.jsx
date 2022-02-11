const Button = (props) => {
  const colors = {
    default: {
      text: `text-black`,
      bg: `bg-stone-200`,
      bgHover: `hover:bg-stone-300`,
      hover: `focus:ring-stone-300`,
    },
    primary: {
      text: `text-white`,
      bg: `bg-primary-600`,
      bgHover: `hover:bg-primary-700`,
      hover: `focus:ring-primary-500`,
    },
    red: {
      text: `text-white`,
      bg: `bg-red-600`,
      bgHover: `hover:bg-red-700`,
      hover: `focus:ring-red-500`,
    },
  };
  const color = colors[props.color] || colors.default;

  return (
    <button
      className={`mr-2 mb-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md ${color.text} ${color.bg} ${color.bgHover} ${color.focus} focus:outline-none focus:ring-2 focus:ring-offset-2`}
      {...props}
    >
      {props.children}
    </button>
  );
};

export default Button;
