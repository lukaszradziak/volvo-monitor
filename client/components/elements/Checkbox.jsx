const Checkbox = (props) => (
  <div className="py-4">
    <input
      type="checkbox"
      className="mb-2 focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
      checked={props.value}
      {...props}
    />
  </div>
);

export default Checkbox;
