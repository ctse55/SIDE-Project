import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import React, { useState } from 'react';
import WalletCard from './WalletCard';

export { Home };

function Home() {
    const auth = useSelector((state) => state.auth.value);
    const [showWalletCard, setShowWalletCard] = useState(false);
    const navigate = useNavigate();

    const handleHealthcareDatabaseClick = () => {
        navigate('/healthcare-database'); // Navigate to the healthcare database page
    };

    return (
        <div style={{ margin: '0 auto', maxWidth: '800px', height: '100vh', position: 'relative' }}>
            <h1>Hi {auth?.firstName}!</h1>
            <p>Welcome to your SIDE Dashboard</p>
            <p><Link to="/users">Manage Users</Link></p>

            {/* Connect Wallet Button */}
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button onClick={() => setShowWalletCard(true)}>Connect to Wallet</button>
            </div>

            {/* Show WalletCard if button clicked */}
            {showWalletCard && <WalletCard />}

            {/* Access Medical Database Button */}
            <div style={{ marginTop: '200px', textAlign: 'center' }}>
                <button onClick={handleHealthcareDatabaseClick}>Access Medical Database</button>
            </div>

            {/* File Sharing Button */}
            <div style={{ marginTop: '200px', textAlign: 'center' }}>
                <button onClick={() => navigate('/file-sharing')}>File Sharing</button>
            </div>
        </div>
    );
}
