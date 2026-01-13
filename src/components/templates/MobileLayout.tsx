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
                        <span className="brand-linkbox">LinkBox</span>
                        <span className="brand-shop">Shop</span>
                    </div>
                </div>
            </header>

          

            <main className="mobile-content">
                {children}
            </main>
        </div>
    );
};
