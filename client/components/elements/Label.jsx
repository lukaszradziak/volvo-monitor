const Label = (props) => (
  <label className="block text-sm font-medium text-gray-700" {...props}>
    {props.children}
    {props.required ? <span className="text-red-700"> *</span> : null}
  </label>
);

export default Label;
