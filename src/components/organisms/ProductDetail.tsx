import React from 'react';
import type { Product } from '../../domain/models/Product';
import { Button } from '../atoms/Button';
import './ProductDetail.css';

interface ProductDetailProps {
    product: Product;
    onBuy: (quantity: number) => void;
    onAddToCart: (quantity: number) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBuy, onAddToCart }) => {
    const [isZoomOpen, setIsZoomOpen] = React.useState(false);
    const [quantity, setQuantity] = React.useState(1);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-CO').format(price);
    };

    const handleQuantityChange = (delta: number) => {
        const newQty = quantity + delta;
        if (newQty >= 1 && newQty <= product.availableStock) {
            setQuantity(newQty);
        }
    };

    return (
        <>
            <div className="product-detail">
                <div className="image-section">
                    <div className="main-image" onClick={() => setIsZoomOpen(true)} title="Click para ampliar">
                        <img src={product.imageUrl} alt={product.name} />
                        <div className="zoom-hint"> Ampliar</div>
                    </div>
                </div>

                <div className="info-section">
                    <div className="breadcrumb">
                        Home › {product.category?.name || 'Products'} › {product.name}
                    </div>

                    <h1 className="product-name">{product.name}</h1>

                    <div className="rating-section">
                        <div className="stars">{'★'.repeat(Math.round(product.averageRating))}{'☆'.repeat(5 - Math.round(product.averageRating))}</div>
                        <span className="review-count">{product.averageRating.toFixed(1)} ({product.reviewCount} reviews)</span>
                    </div>

                    <div className="price-section">
                        <div className="price-main">
                            <span className="currency">$</span>
                            <span className="amount">{formatPrice(product.price)}</span>
                        </div>
                        <div className="price-details">
                            <span className="payment-info">En 6x ${formatPrice(Math.floor(product.price / 6))} sin interés</span>
                        </div>
                    </div>

                    <div className="stock-info">
                        {product.availableStock > 5 ? (
                            <div className="in-stock">
                                <span>Disponible   {product.availableStock} unidades</span>
                            </div>
                        ) : product.availableStock > 0 ? (
                            <div className="low-stock">
                                <span>¡Últimas {product.availableStock} unidades!</span>
                            </div>
                        ) : (
                            <div className="out-of-stock">
                                <span>Este producto no esta disponible.</span>
                            </div>
                        )}
                    </div>

                    {product.availableStock > 0 && (
                        <div className="quantity-selector-section">
                            <span className="quantity-label">Cantidad:</span>
                            <div className="quantity-control-detailed">
                                <button
                                    className="qty-btn-detail"
                                    onClick={() => handleQuantityChange(-1)}
                                    disabled={quantity <= 1}
                                >-</button>
                                <span className="qty-display-detail">{quantity}</span>
                                <button
                                    className="qty-btn-detail"
                                    onClick={() => handleQuantityChange(1)}
                                    disabled={quantity >= product.availableStock}
                                >+</button>
                            </div>
                            <span className="stock-hint">({product.availableStock} disponibles)</span>
                        </div>
                    )}

                    <div className="shipping-info">
                        <div className="shipping-item">
                            <div className="shipping-text">
                                <div className="shipping-label">Envío GRATIS</div>
                                <div className="shipping-detail">Llega mañana</div>
                            </div>
                        </div>
                        <div className="shipping-item">
                            <div className="shipping-text">
                                <div className="shipping-label">Devolución gratis</div>
                                <div className="shipping-detail">Tienes 30 días desde que lo recibes</div>
                            </div>
                        </div>
                    </div>

                    <div className="cta-section">
                        <Button
                            onClick={() => onBuy(quantity)}
                            variant="primary"
                            fullWidth
                            disabled={product.availableStock === 0}
                        >
                            Comprar ahora
                        </Button>
                        <Button
                            variant="outline"
                            fullWidth
                            disabled={product.availableStock === 0}
                            onClick={() => onAddToCart(quantity)}
                        >
                            Agregar al carrito
                        </Button>
                    </div>

                    <div className="specs-section">
                        <h3 className="specs-title">Características del producto</h3>
                        <div className="specs-list">
                            {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                                <div key={key} className="spec-item">
                                    <span className="spec-label">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                                    <span className="spec-value">
                                        {Array.isArray(value) ? value.join(', ') : String(value)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="description-section">
                        <h3 className="description-title">Descripción</h3>
                        <p className="description-text">
                            {product.description || `${product.name} de alta calidad.`}
                        </p>
                        {product.brand && (
                            <p className="brand-info">
                                <strong>Marca:</strong> {product.brand}
                            </p>
                        )}
                    </div>
                </div>
            </div>
            {isZoomOpen && (
                <div className="image-modal-overlay" onClick={() => setIsZoomOpen(false)}>
                    <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-modal-btn" onClick={() => setIsZoomOpen(false)}>×</button>
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="modal-image"
                        />
                    </div>
                </div>
            )}
        </>
    );
};
