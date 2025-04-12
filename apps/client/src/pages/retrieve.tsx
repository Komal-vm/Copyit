import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function RetrievePage() {
  const router = useRouter();
  const { token } = router.query;
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token || typeof token !== "string") return;

    const fetchMessage = async () => {
      try {
        const res = await fetch(`/api/get-message?token=${encodeURIComponent(token)}`);
        const data = await res.json();

        if (res.ok) {
          setMessage(data.message);
        } else {
          setError(data.error || "Could not retrieve message");
        }
      } catch {
        setError("Network error");
      }
    };

    fetchMessage();
  }, [token]);

  return (
    <main className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold text-center mb-4">📥 Retrieved Message</h1>

      {error ? (
        <div className="bg-red-100 border border-red-400 p-4 rounded text-red-700">
          ❌ {error}
        </div>
      ) : (
        <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded text-sm font-mono">
          {message}
        </pre>
      )}
    </main>
  );
}
