'use client'

// components/common/Button.jsx
export default function Button({ children, onClick, variant = 'primary' }) {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700',
    secondary: 'bg-gray-600 hover:bg-gray-700',
    danger: 'bg-red-600 hover:bg-red-700'
  };

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md text-white ${variants[variant]}`}
    >
      {children}
    </button>
  );
}