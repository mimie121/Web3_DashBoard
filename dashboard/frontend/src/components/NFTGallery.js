import React, { useEffect, useState } from "react";
import axios from "axios";

export default function NFTGallery({ address }) {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNFTs = async () => {
    if (!address) return;
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/nfts/${address}`);
      setNfts(res.data.ownedNfts || []);
    } catch (err) {
      console.error("NFT fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNFTs();
  }, [address]);

  return (
    <div className="card">
      <h2>NFT Gallery</h2>

      {loading && <p>Loading NFTs...</p>}
      {!loading && nfts.length === 0 && <p>No NFTs found.</p>}

      <div className="nft-grid">
        {nfts.map((nft, i) => (
          <div key={i} className="card nft-card">
            {nft.media && nft.media[0]?.gateway ? (
              <img src={nft.media[0].gateway} alt={nft.title} />
            ) : (
              <div className="nft-placeholder" />
            )}
            <p className="nft-title">{nft.title || "Untitled"}</p>
            <p className="nft-address">{nft.contract?.address.slice(0, 10)}...</p>
          </div>
        ))}
      </div>

      <button className="button-primary" onClick={fetchNFTs}>
        Refresh
      </button>
    </div>
  );
}
