import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { removeFromCart, updateQuantity } from '../../store/slices/cart.slice';
import { useCheckoutFlow } from '../../hooks/useCheckoutFlow'; // We can't use hook inside callback easily if not top level
import './CartDrawer.css'; // Ensure CSS fits

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
    const dispatch = useAppDispatch();
    const { items, totalAmount } = useAppSelector((state) => state.cart);
    const { startCheckout } = useCheckoutFlow();

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(price);
    };

    const handleUpdateQuantity = (id: string, newQty: number) => {
        if (newQty < 1) return;
        dispatch(updateQuantity({ id, quantity: newQty }));
    };

    const handleRemove = (id: string) => {
        dispatch(removeFromCart(id));
    };

    const handleCheckout = () => {
        if (items.length === 0) return;

        const checkoutItems = items.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
            name: item.name,
            image: item.imageUrl
        }));

        startCheckout(checkoutItems);
        onClose();
    };

    return (
        <div className={`cart-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
            <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
                <header className="cart-header">
                    <h2 className="cart-title">Tu Carrito</h2>
                    <button className="close-btn" onClick={onClose} aria-label="Cerrar carrito">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </header>

                <div className="cart-body">
                    {items.length === 0 ? (
                        <div className="cart-empty-state">
                            <p>Tu carrito está vacío</p>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className="cart-item">
                                <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
                                <div className="cart-item-info">
                                    <h3 className="item-title">{item.name}</h3>
                                    <span className="item-price">{formatPrice(item.price)}</span>
                                </div>

                                <div className="cart-controls">
                                    <div className="quantity-control">
                                        <div className="qty-btn" role="button" onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>-</div>
                                        <span className="qty-display">{item.quantity}</span>
                                        <div className="qty-btn" role="button" onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>+</div>
                                    </div>
                                    <button className="remove-btn" onClick={() => handleRemove(item.id)} aria-label="Eliminar">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M3 6h18"></path>
                                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <footer className="cart-footer">
                    <div className="cart-total">
                        <span className="total-label">Subtotal</span>
                        <span className="total-amount">{formatPrice(totalAmount)}</span>
                    </div>
                    <button
                        className="checkout-btn"
                        disabled={items.length === 0}
                        onClick={handleCheckout}
                    >
                        Ir a Pagar
                    </button>
                </footer>
            </div>
        </div>
    );
};
