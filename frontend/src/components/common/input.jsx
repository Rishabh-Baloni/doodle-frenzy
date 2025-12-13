'use client'

// components/common/Input.jsx
export default function Input({ value, onChange, placeholder }) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="px-3 py-2 border rounded-md w-full"
    />
  );
}