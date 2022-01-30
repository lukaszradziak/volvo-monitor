const Label = (props) => (
  <label className="block text-sm font-medium text-gray-700" {...props}>
    {props.children}
  </label>
);

export default Label;
