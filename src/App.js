import React from 'react';
import NFTViewer from './NFTViewer';

function App() {
    const alchemyUrl = 'https://polygon-mumbai.g.alchemy.com/v2/IadqmkZ73ViHW4sZZXqEd9o_3N1p6n8U'; // Replace with your Alchemy API URL

    return (
        <div className="App">
            <header className="App-header">
                <h1>NFT Viewer</h1>
                <NFTViewer alchemyUrl={alchemyUrl} />
            </header>
        </div>
    );
}

export default App;
