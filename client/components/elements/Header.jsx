const Header = (props) => (
  <h2 className="block text-sm text-gray-700 font-bold" {...props}>
    {props.children}
  </h2>
);

export default Header;
