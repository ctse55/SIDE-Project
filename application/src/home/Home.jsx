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
        <div style={{ margin: '0 auto', maxWidth: '800px', padding: '20px', height: '100vh', boxSizing: 'border-box' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Hi {auth?.firstName}!</h1>
            <p style={{ textAlign: 'center', marginBottom: '30px' }}>Welcome to your SIDE Dashboard</p>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <Link to="/users" style={{ textDecoration: 'none', color: '#007bff' }}>
                    Manage Users
                </Link>
            </div>

            {/* Connect Wallet Button */}
            <div style={{ marginBottom: '40px', textAlign: 'center' }}>
                <button
                    onClick={() => setShowWalletCard(true)}
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        borderRadius: '5px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                    }}
                >
                    Connect to Wallet
                </button>
            </div>

            {/* Show WalletCard if button clicked */}
            {showWalletCard && (
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <WalletCard />
                </div>
            )}

            {/* Access Medical Database Button */}
            <div style={{ marginBottom: '40px', textAlign: 'center' }}>
                <button
                    onClick={handleHealthcareDatabaseClick}
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        borderRadius: '5px',
                        backgroundColor: '#28a745',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                    }}
                >
                    Access Medical Database
                </button>
            </div>

            {/* File Sharing Button */}
            <div style={{ textAlign: 'center' }}>
                <button
                    onClick={() => navigate('/file-sharing')}
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        borderRadius: '5px',
                        backgroundColor: '#ffc107',
                        color: '#000',
                        border: 'none',
                        cursor: 'pointer',
                    }}
                >
                    File Sharing
                </button>
            </div>
        </div>
    );
}
