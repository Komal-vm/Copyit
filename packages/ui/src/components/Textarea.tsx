// packages/ui/components/Textarea.tsx
export const Textarea = ({
    value,
    onChange,
    placeholder,
  }: {
    value: string;
    onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
    placeholder: string;
  }) => (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-3 border border-gray-300 rounded-md resize-none"
    />
  );
  