import React, { useState } from 'react';
import Web3 from 'web3';
import { create as ipfsClient } from 'ipfs-http-client';

const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');
const ipfs = ipfsClient('https://ipfs.infura.io:5001/api/v0');
const contractABI = [/* ABI here */];
const contractAddress = 'YOUR_CONTRACT_ADDRESS';
const contract = new web3.eth.Contract(contractABI, contractAddress);

function FileUpload() {
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        try {
            const result = await ipfs.add(file);
            const fileHash = result.path;

            const accounts = await web3.eth.getAccounts();
            await contract.methods.uploadFile(fileHash).send({ from: accounts[0] });

            alert('File uploaded successfully');
        } catch (error) {
            alert('Error uploading file');
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload File</button>
        </div>
    );
}

export default FileUpload;
