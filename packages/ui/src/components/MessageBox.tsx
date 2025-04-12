// packages/ui/components/MessageBox.tsx
export const MessageBox = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-gray-100 text-gray-800 p-4 border border-gray-300 rounded-md">
      {children}
    </div>
  );
  