const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { Alchemy, Network, Utils, Wallet } = require("alchemy-sdk");

const app = express();
app.use(cors());
app.use(express.json());

const alchemy = new Alchemy({
    apiKey: process.env.ALCHEMY_API_KEY,
    network: Network.ETH_SEPOLIA, 
});

// Wallet for sending transactions
const wallet = new Wallet(process.env.PRIVATE_KEY);

//////////////////////////
// TOKEN API
//////////////////////////
app.get("/tokens/:address", async (req, res) => {
    const address = req.params.address;
    const balances = await alchemy.core.getTokenBalances(address);
    res.json(balances);
});

//////////////////////////
// NFT API
//////////////////////////
app.get("/nfts/:address", async (req, res) => {
    const address = req.params.address;
    const nfts = await alchemy.nft.getNftsForOwner(address);
    res.json(nfts);
});

//////////////////////////
// TRANSACT — send ETH
//////////////////////////
app.post("/send", async (req, res) => {
    const { to, amount } = req.body;

    const nonce = await alchemy.core.getTransactionCount(wallet.address, "latest");

    const tx = {
        to,
        value: Utils.parseEther(amount),
        gasLimit: 21000,
        maxPriorityFeePerGas: Utils.parseUnits("5", "gwei"),
        maxFeePerGas: Utils.parseUnits("20", "gwei"),
        nonce,
        chainId: 11155111,
        type: 2,
    };

    const signed = await wallet.signTransaction(tx);
    const sentTx = await alchemy.core.sendTransaction(signed);

    res.json({ hash: sentTx.hash });
});

//////////////////////////
// ENHANCED WEBSOCKETS — live transactions
//////////////////////////
app.get("/live/:address", async (req, res) => {
    const address = req.params.address;

    alchemy.ws.on(
        {
            method: "alchemy_pendingTransactions",
            fromAddress: [address],
        },
        (tx) => {
            console.log("Live Tx:", tx);
        }
    );

    res.json({ message: "Live tracking started" });
});

// Start server
app.listen(5000, () => {
    console.log(" Backend running on port 5000");
});
