// src/components/atoms/Label.jsx
const Label = ({ htmlFor, children }) => {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
      {children}
    </label>
  );
};

export default Label;

