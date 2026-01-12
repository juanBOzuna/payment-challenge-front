import React from 'react';
import './CartDrawer.css';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
    // Mock Data for Visual Testing
    const mockItems = [
        {
            id: 1,
            name: "Premium T-Shirt",
            price: 25000,
            quantity: 2,
            image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
        },
        {
            id: 2,
            name: "Designer Hoodie",
            price: 45000,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
        },
        {
            id: 3,
            name: "Slim Fit Jeans",
            price: 60000,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
        }
    ];

    const total = mockItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(price);
    };

    if (!isOpen) {
        // We still render the overlay to allow animation exiting if we were handling conditional rendering
        // But for CSS transition (transform), it needs to be in DOM usually, or we use class toggling.
        // The CSS assumes .cart-overlay.open structure, so we render always but change class.
        // However, if logic unmounts it, standard CSS transition on exit is hard.
        // Let's rely on parent passing isOpen and us toggling the class.
    }

    return (
        <div className={`cart-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
            <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <header className="cart-header">
                    <h2 className="cart-title">Tu Carrito ({mockItems.length})</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </header>

                {/* Body */}
                <div className="cart-body">
                    {mockItems.map((item) => (
                        <div key={item.id} className="cart-item">
                            <img src={item.image} alt={item.name} className="cart-item-image" />
                            <div className="cart-item-info">
                                <h3 className="item-title">{item.name}</h3>
                                <span className="item-price">{formatPrice(item.price)}</span>
                            </div>

                            <div className="cart-controls">
                                <div className="quantity-control">
                                    <div className="qty-btn" role="button">-</div>
                                    <span className="qty-display">{item.quantity}</span>
                                    <div className="qty-btn" role="button">+</div>
                                </div>
                                <button className="remove-btn" aria-label="Eliminar">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 6h18"></path>
                                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <footer className="cart-footer">
                    <div className="cart-total">
                        <span className="total-label">Subtotal</span>
                        <span className="total-amount">{formatPrice(total)}</span>
                    </div>
                    <button className="checkout-btn">
                        Ir a Pagar
                    </button>
                </footer>
            </div>
        </div>
    );
};
