import React, { useState } from 'react';
import {
    CO2_TOKEN_ADDRESS,
    CO2_TOKEN_ABI,
    ALCHEMY_URL
} from './config';
import styles from './NFTViewer.module.css';
import Web3 from 'web3';

const NFTViewer = () => {
    const [nftData, setNftData] = useState(null);
    const [totalSupply, setTotalSupply] = useState('');
    const [tokenID, setTokenID] = useState('');
    const [contractAddress, setContractAddress] = useState('');
    const [error, setError] = useState('');

    const fetchNFTData = async (contractAddress, tokenId) => {
        const web3 = new Web3(ALCHEMY_URL);

        try {
            const nftAbi = await import('./ForestNFTABI.json');
            const nftContract = new web3.eth.Contract(nftAbi.default, contractAddress);
            const co2TokenContract = new web3.eth.Contract(CO2_TOKEN_ABI, CO2_TOKEN_ADDRESS);

            const tokenURI = await nftContract.methods.tokenURI(tokenId).call();
            const response = await fetch(tokenURI);
            const metadata = await response.json();

            const forestData = await nftContract.methods.forests(tokenId).call();
            const supply = await co2TokenContract.methods.totalSupply().call();

            setNftData({ 
                ...metadata, 
                ...forestData,
                size: forestData.size.toString(),
                co2PerHectare: forestData.co2PerHectare.toString(),
                geoLocationHash: forestData.geoLocationHash,
                topographicPlanHash: forestData.topographicPlanHash,
                soilStudiesHash: forestData.soilStudiesHash,
                ownershipTitleHash: forestData.ownershipTitleHash,
                CO2CapCalculationHash: forestData.CO2CapCalculationHash
            });
            setTotalSupply(Web3.utils.fromWei(supply, 'ether'));
            setError('');

        } catch (error) {
            console.error('Error fetching NFT data:', error);
            setError('Error fetching NFT data. Make sure the contract address and token ID are correct.');
        }
    };

    const handleTokenIDChange = (e) => {
        setTokenID(e.target.value);
    };

    const handleContractAddressChange = (e) => {
        setContractAddress(e.target.value);
    };

    const handleSubmit = () => {
        fetchNFTData(contractAddress, tokenID);
    };

    return (
        <div className={styles.container}>
            <input
                type="text"
                value={contractAddress}
                onChange={handleContractAddressChange}
                placeholder="Enter NFT Contract Address"
                className={styles.input}
            />
            <input
                type="text"
                value={tokenID}
                onChange={handleTokenIDChange}
                placeholder="Enter NFT Token ID"
                className={styles.input}
            />
            <button onClick={handleSubmit} className={styles.button}>Fetch NFT Data</button>
            {error && <p className={styles.error}>{error}</p>}
            {nftData && (
                <div className={styles.nftCard}>
                    <div className={styles.nftInfoContainer}>
                        <div className={styles.nftInfo}>
                            <h2 className={styles.nftTitle}>{nftData.name}</h2>
                            <p className={styles.nftDescription}>{nftData.description}</p>
                            <p>Size in Hectares: {nftData.size}</p>
                            <p>CO2/Tones per Hectare: {nftData.co2PerHectare}</p>
                            <p>Total CO2 Token Supply: {totalSupply}</p>
                        </div>
                        <img src={nftData.image} alt={nftData.name} className={styles.nftImage} />
                    </div>
                    <div className={styles.nftAdditionalAttributes}>
                        <h3>Asset Underlying Attributes:</h3>
                        <div className={styles.attributeGroup}>
                            <p><strong>Geolocation:</strong> <a href={nftData.geolocation} target="_blank" rel="noopener noreferrer">Document</a></p>
                            <p>Hash: {nftData.geoLocationHash}</p>
                        </div>
                        <div className={styles.attributeGroup}>
                            <p><strong>Topographic Plan:</strong> <a href={nftData.topographicPlan} target="_blank" rel="noopener noreferrer">Document</a></p>
                            <p>Hash: {nftData.topographicPlanHash}</p>
                        </div>
                        <div className={styles.attributeGroup}>
                            <p><strong>Soil Studies:</strong> <a href={nftData.soilStudies} target="_blank" rel="noopener noreferrer">Document</a></p>
                            <p>Hash: {nftData.soilStudiesHash}</p>
                        </div>
                        <div className={styles.attributeGroup}>
                            <p><strong>Ownership Title:</strong> <a href={nftData.ownershipTitle} target="_blank" rel="noopener noreferrer">Document</a></p>
                            <p>Hash: {nftData.ownershipTitleHash}</p>
                        </div>
                        <div className={styles.attributeGroup}>
                            <p><strong>CO2 Capacity Calculation:</strong> <a href={nftData.CO2CapCalculation} target="_blank" rel="noopener noreferrer">Document</a></p>
                            <p>Hash: {nftData.CO2CapCalculationHash}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NFTViewer;
