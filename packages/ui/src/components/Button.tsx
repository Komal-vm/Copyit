// packages/ui/components/Button.tsx
export const Button = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button
      {...props}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
    >
      {children}
    </button>
  );
  