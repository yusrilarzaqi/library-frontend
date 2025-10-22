// src/components/atoms/Button.jsx
const Button = ({ children, onClick, variant = 'primary', className, ...props }) => {
  const base = "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm "
  const variants = {
    indigo: 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-white',
    primary: 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-white',
    danger: 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 text-white',
    success: 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 text-white',
    outline: 'bg-transparent border border-gray-900 text-gray-700 text-black',
    secondary: 'bg-gray-300 hover:bg-gray-300 text-black px-3 py-2'
  };

  return (
    <button onClick={onClick} className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;

