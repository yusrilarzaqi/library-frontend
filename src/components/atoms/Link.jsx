import { Link } from 'react-router-dom';

function LinkComponent({ to, variant = 'primary', children, className, ...props }) {
  const base = "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white"
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
    danger: 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500',
    outline: 'bg-transparent border border-gray-400 text-gray-700',
  };
  return (
    <Link
      to={to}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}

export default LinkComponent;
