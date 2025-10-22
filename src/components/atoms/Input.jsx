const Input = ({ name, onChange, placeholder, type = 'text', className, ...props }) => {
  return (
    <input
      id={name}
      name={name}
      type={type}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${className}`}
      {...props}
    />
  );
};

export default Input;

