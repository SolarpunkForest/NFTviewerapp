// src/App.js
import React from 'react';
import NFTViewer from './NFTViewer';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>NFT Viewer</h1>
                <NFTViewer alchemyUrl='https://polygon-amoy.g.alchemy.com/v2/SW3ysxKZUxdGtB-90ocNePoFM7mZOxZ9' />
            </header>
        </div>
    );
}

export default App;

