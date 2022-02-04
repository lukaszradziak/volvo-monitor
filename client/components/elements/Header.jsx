const Header = (props) => (
  <h2 className="block text-sm font-medium text-gray-700" {...props}>
    {props.children}
  </h2>
);

export default Header;
