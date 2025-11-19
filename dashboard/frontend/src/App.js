import React, { useState } from "react";
import TokenList from "./components/TokenList";
import NFTGallery from "./components/NFTGallery";
import SendTransaction from "./components/SendTransaction";
import LiveActivity from "./components/LiveActivity";

import "./App.scss";

function App() {
  const [address, setAddress] = useState("");

  const handleTxSent = (hash) => {
    alert(`Transaction sent: ${hash}`);
  };

  return (
    <div className="container">
      <header>
        <h1>Web3 Dashboard</h1>
        <input
          type="text"
          placeholder="Enter Wallet Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </header>

      <div className="grid">
        <div>
          <TokenList address={address} />
          <SendTransaction onSent={handleTxSent} />
        </div>

        <div>
          <NFTGallery address={address} />
          <LiveActivity address={address} />
        </div>
      </div>
    </div>
  );
}

export default App;
