import React, { useEffect, useState } from "react";
import axios from "axios";

export default function TokenList({ address }) {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTokens = async () => {
    if (!address) return;
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/tokens/${address}`);
      setTokens(res.data.tokenBalances || []);
    } catch (err) {
      console.error("Token fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens();
  }, [address]);

  return (
    <div className="card">
      <h2>ERC-20 Tokens</h2>

      {loading && <p>Loading tokens...</p>}
      {!loading && tokens.length === 0 && <p>No tokens found.</p>}

      <ul>
        {tokens.map((t, i) => (
          <li key={i}>
            <p><strong>Contract:</strong> {t.contractAddress}</p>
            <p><strong>Balance:</strong> {t.tokenBalance}</p>
          </li>
        ))}
      </ul>

      <button className="button-primary" onClick={fetchTokens}>
        Refresh
      </button>
    </div>
  );
}
