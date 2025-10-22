// src/components/molecules/InputField.jsx
import Label from '../atoms/Label';
import Input from '../atoms/Input';

const InputField = ({ id, label, type = 'text', value, onChange, error }) => {
  return (
    <div className="mb-4">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} value={value} onChange={onChange} />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default InputField;

