import { useState } from "react";
import { useRouter } from "next/router";
import Button  from "@mui/material/Button"
import { TextField, Typography } from "@mui/material";
import Box from '@mui/material/Box';
import Privacypolicy from "./privacy-policy";
import Terms from "@/pages/terms-of-service";
export default function Home() {
  const [message, setMessage] = useState("");
  const [tokenInput, setTokenInput] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const sendMessage = async () => {
    setError("");
    try {
      const res = await fetch("/api/store-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Network error");
    }
  };

  const retrieveMessage = () => {
    if (tokenInput.trim()) {
      router.push(`/retrieve?token=${encodeURIComponent(tokenInput.trim())}`);
    }
  };

  return (
    <main className="max-w-xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-2xl font-bold text-center">🔐 Token Text Exchange</h1>
      <div style={{display:"flex",justifyContent:"space-around",flexWrap:"wrap"}}>
      <div className="space-y-3">
        <TextField 
        style={{width:"600px"}}
          multiline
          rows={10}
          
          placeholder="Paste your message or code here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full h-40 p-3 border rounded font-mono text-sm"
          
        />
        <div>
          <br></br>
        <Button variant="contained" style={{}}
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        > 
          Generate Token
        </Button>
        </div>
        

        {token && (
          <div className="bg-green-100 border border-green-400 p-3 rounded text-sm break-words">
            ✅ Token: <strong>{token}</strong>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 p-3 rounded text-sm text-red-600">
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* <hr className="my-6" /> */}

      <div className="space-y-2" >
        <div>
        <TextField
          multiline
          style={{width:"400px"}}
          label="Enter token to retrieve message"
          value={tokenInput}
          onChange={(e) => setTokenInput(e.target.value)}
          className="w-full p-3 border rounded text-sm"
          
        />
        </div>
        <br></br>
        <div>
        <Button variant="contained"
        
          onClick={retrieveMessage}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Retrieve Message
        </Button>
        </div>
        
      </div>
      </div>
     
      

<div style={{
  position:"fixed",
  left:0,
  bottom:0,
  width:"100%",
  height:"17%",
  backgroundColor:"	#808080",
  color:"white",
  textAlign:"center"

}}>
  <Typography>website by <a href="https://github.com/Komal-vm">@komal-vm</a> </Typography>
  <div className="flex flex-col sm:flex-row justify-center gap-4">
    <span>© {new Date().getFullYear()} copyit </span>
    <a href="/privacy-policy" className="hover:underline">Privacy Policy</a>
    <br></br>
    <a href="/terms-of-service" className="hover:underline">Terms of Service </a>
    <br></br>
    <a href="mailto:komalchakradhar123@gmail.com" className="hover:underline">komalchakradhar123@gmail.com </a>
    <br></br>
    <a href="tel:+917892253772" className="hover:underline">+91 7892253772</a>
  </div>
   
</div>
    </main>
  );
}
