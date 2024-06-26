import React, { useState } from 'react';
import contractABI from './ForestNFTABI.json';
import co2TokenABI from './CO2TokenABI.json';
import styles from './NFTViewer.module.css';
import Web3 from 'web3';

const NFTViewer = ({ alchemyUrl }) => {
    const [nftData, setNftData] = useState(null);
    const [totalSupply, setTotalSupply] = useState('');
    const [inputValue, setInputValue] = useState('');
    const contractAddress = '0x18AcafB6D7df58CB9761786A50Ac279d82c9c974'; // Updated NFT contract address
    const co2TokenAddress = '0x7f0fea0AD75cb20DD2AFEc833068C66D3acC7EAD'; // Updated CO2 token contract address

    const fetchNFTData = async (tokenId) => {
        const web3 = new Web3(alchemyUrl);
        const nftContract = new web3.eth.Contract(contractABI, contractAddress);
        const co2TokenContract = new web3.eth.Contract(co2TokenABI, co2TokenAddress);

        try {
            const tokenURI = await nftContract.methods.tokenURI(tokenId).call();
            const response = await fetch(tokenURI);
            const metadata = await response.json();

            const forestData = await nftContract.methods.forests(tokenId).call();
            const supply = await co2TokenContract.methods.totalSupply().call();

            setNftData({ 
                ...metadata, 
                ...forestData,
                size: forestData.size.toString(),
                co2PerHectare: forestData.co2PerHectare.toString()
            });
            setTotalSupply(Web3.utils.fromWei(supply, 'ether'));

        } catch (error) {
            console.error('Error fetching NFT data:', error);
        }
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSubmit = () => {
        fetchNFTData(inputValue);
    };

    return (
        <div className={styles.container}>
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Enter NFT Token ID"
            />
            <button onClick={handleSubmit}>Fetch NFT Data</button>
            {nftData && (
                <div className={styles.nftCard}>
                    <h2 className={styles.nftTitle}>{nftData.name}</h2>
                    <img src={nftData.image} alt={nftData.name} className={styles.nftImage} />
                    <p className={styles.nftDescription}>{nftData.description}</p>
                    <p>Size in Hectares= {nftData.size}</p>
                    <p>CO2 per Hectare= {nftData.co2PerHectare}</p>
                    <p>Total CO2 Token Supply= {totalSupply}</p>
                    <div className={styles.nftAdditionalAttributes}>
                        <h3>Asset underlying attributes:</h3>
                        <p><a href={nftData.geolocation} target="_blank" rel="noopener noreferrer">Geolocation</a></p>
                        <p><a href={nftData.topographicPlan} target="_blank" rel="noopener noreferrer">Topographic Plan</a></p>
                        <p><a href={nftData.soilStudies} target="_blank" rel="noopener noreferrer">Soil Studies</a></p>
                        <p><a href={nftData.ownershipTitle} target="_blank" rel="noopener noreferrer">Ownership Title</a></p>
                        <p><a href={nftData.CO2CapCalculation} target="_blank" rel="noopener noreferrer">CO2 Capacity Calculation</a></p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NFTViewer;
