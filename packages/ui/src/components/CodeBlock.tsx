// packages/ui/components/CodeBlock.tsx
export const CodeBlock = ({ children }: { children: React.ReactNode }) => (
    <pre className="bg-gray-800 text-white p-4 rounded-md font-mono">
      <code>{children}</code>
    </pre>
  );
  