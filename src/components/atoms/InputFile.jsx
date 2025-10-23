const Input = ({ name, onChange, accept = "image/*", variant, ...props }) => {
  const selectVariant = {
    primary: "hover:file:bg-blue-100 file:bg-blue-600",
    success: "hover:file:bg-green-100 file:bg-green-600"
  }
  return (
    <input
      id={name}
      name={name}
      onChange={onChange}
      accept={accept}
      type="file"
      className={`appearance-none block w-full text-sm text-gray-700 border border-gray-300 rounded-md cursor-pointer file:mr-3 file:py-2 file:px-4 file:border-0 file:text-white ${selectVariant[variant]} `}
      {...props}
    />
  );
};
// <input  aria-describedby="user_avatar_help" id="user_avatar" type="file">

export default Input;

