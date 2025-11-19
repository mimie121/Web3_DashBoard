import React, { useEffect, useState } from "react";
import axios from "axios";

export default function LiveActivity({ address }) {
  const [logs, setLogs] = useState([]);
  const [active, setActive] = useState(false);

  const startLive = async () => {
    if (!address) return;
    await axios.get(`http://localhost:5000/live/${address}`);
    setActive(true);
  };

  useEffect(() => {
    if (!active) return;

    const ws = new WebSocket(
      `wss://eth-sepolia.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_KEY}`
    );

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          method: "alchemy_pendingTransactions",
          params: [{ fromAddress: [address] }],
          id: 1,
          jsonrpc: "2.0",
        })
      );
    };

    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data?.params?.result) {
        setLogs((prev) => [data.params.result, ...prev]);
      }
    };

    return () => ws.close();
  }, [active, address]);

  return (
    <div className="card">
      <h2>Live Activity</h2>

      {!active && (
        <button className="button-primary" onClick={startLive}>
          Start Tracking
        </button>
      )}

      {active && (
        <div className="logs">
          {logs.length === 0 && <p>Waiting for activity...</p>}

          {logs.map((tx, i) => (
            <div key={i} className="card log-card">
              <p><strong>Tx Hash:</strong> {tx.hash}</p>
              <p><strong>To:</strong> {tx.to}</p>
              <p><strong>Value:</strong> {tx.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
