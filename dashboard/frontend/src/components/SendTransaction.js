import React, { useState } from "react";
import axios from "axios";

export default function SendTransaction({ onSent }) {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");

  const sendTx = async () => {
    if (!to || !amount) {
      setStatus("Enter address and amount.");
      return;
    }

    try {
      setStatus("Sending...");
      const res = await axios.post("http://localhost:5000/send", { to, amount });
      setStatus("Transaction sent: " + res.data.hash);
      onSent && onSent(res.data.hash);
      setTo("");
      setAmount("");
    } catch (err) {
      console.error(err);
      setStatus("Error sending transaction");
    }
  };

  return (
    <div className="card">
      <h2>Send ETH</h2>

      <input
        type="text"
        placeholder="Recipient address"
        value={to}
        onChange={(e) => setTo(e.target.value)}
      />
      <input
        type="text"
        placeholder="Amount in ETH"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button className="button-success" onClick={sendTx}>
        Send
      </button>

      {status && <p>{status}</p>}
    </div>
  );
}
