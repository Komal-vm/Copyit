// packages/ui/components/Input.tsx
export const Input = ({
    value,
    onChange,
    placeholder,
    type = 'text',
  }: {
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    placeholder: string;
    type?: string;
  }) => (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-3 border border-gray-300 rounded-md"
    />
  );
  