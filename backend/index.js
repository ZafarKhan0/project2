const express = require('express');
const Web3 = require('web3');
const IPFS = require('ipfs-http-client');
const fs = require('fs');
const path = require('path');
const contractABI = require('./FileSharingABI.json'); // ABI of your deployed contract

const app = express();
const web3 = new Web3('http://localhost:8545');
const ipfs = IPFS.create({ url: 'https://ipfs.infura.io:5001/api/v0' });
const contractAddress = 'YOUR_CONTRACT_ADDRESS';
const contract = new web3.eth.Contract(contractABI, contractAddress);

app.use(express.json());

// Upload File
app.post('/upload', async (req, res) => {
    try {
        const { filePath } = req.body;
        const file = fs.readFileSync(filePath);
        const result = await ipfs.add(file);
        const fileHash = result.path;

        const accounts = await web3.eth.getAccounts();
        await contract.methods.uploadFile(fileHash).send({ from: accounts[0] });

        res.send({ fileHash });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Download File
app.get('/download/:fileHash', async (req, res) => {
    try {
        const { fileHash } = req.params;
        const accounts = await web3.eth.getAccounts();
        const hasPermission = await contract.methods.checkPermission(fileHash, accounts[0]).call();

        if (hasPermission) {
            const file = await ipfs.cat(fileHash);
            res.send(file);
        } else {
            res.status(403).send('Permission denied');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
