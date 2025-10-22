const Input = ({ name, onChange, accept = "image/*", ...props }) => {
  return (
    <input
      id={name}
      name={name}
      onChange={onChange}
      accept={accept}
      type="file"
      className="appearance-none block w-full text-sm text-gray-700 border border-gray-300 rounded-md cursor-pointer file:mr-3 file:py-2 file:px-4 file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-100"
      {...props}
    />
  );
};
// <input  aria-describedby="user_avatar_help" id="user_avatar" type="file">

export default Input;

