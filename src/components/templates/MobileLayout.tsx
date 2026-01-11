import React from 'react';
import './MobileLayout.css';

interface MobileLayoutProps {
    children: React.ReactNode;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
    return (
        <div className="mobile-layout">
            <header className="mobile-header">
                <div className="header-content">
                    <div className="brand">
                        <span className="brand-wompi">Wompi</span>
                        <span className="brand-shop">Shop</span>
                    </div>
                </div>
            </header>

            {/* <div className="info-banner">
                <p className="info-text">Aprovecha nuestras promociones</p>
            </div> */}

            <main className="mobile-content">
                {children}
            </main>
        </div>
    );
};
