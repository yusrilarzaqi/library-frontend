// src/components/atoms/Heading.jsx
const Heading = ({ level = 1, children, className = '' }) => {
  const Tag = `h${level}`;
  const baseStyles = 'font-bold text-gray-900';

  const sizeMap = {
    1: 'text-3xl',
    2: 'text-2xl',
    3: 'text-xl',
    4: 'text-lg',
    5: 'text-base',
    6: 'text-sm',
  };

  return <Tag className={`${baseStyles} ${sizeMap[level]} ${className}`}>{children}</Tag>;
};

export default Heading;

