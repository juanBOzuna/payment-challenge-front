import React from 'react';
import type { Product } from '../../domain/models/Product';
import { Button } from '../atoms/Button';
import './ProductDetail.css';

interface ProductDetailProps {
    product: Product;
    onBuy: () => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBuy }) => {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-CO').format(price);
    };

    return (
        <div className="product-detail">
            <div className="image-section">
                <div className="main-image">
                    <img src={product.imageUrl} alt={product.name} />
                </div>
            </div>

            <div className="info-section">
                <div className="breadcrumb">
                    Home › Clothing › {product.name}
                </div>

                <h1 className="product-name">{product.name}</h1>

                <div className="rating-section">
                    <div className="stars">★★★★★</div>
                    <span className="review-count">4.8 (324 reviews)</span>
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
                    {product.stock > 5 ? (
                        <div className="in-stock">
                            <span className="stock-icon">✓</span>
                            <span>Disponible • {product.stock} unidades</span>
                        </div>
                    ) : (
                        <div className="low-stock">
                            <span className="stock-icon">⚠</span>
                            <span>¡Últimas {product.stock} unidades!</span>
                        </div>
                    )}
                </div>

                <div className="shipping-info">
                    <div className="shipping-item">
                        <span className="shipping-icon">🚚</span>
                        <div className="shipping-text">
                            <div className="shipping-label">Envío GRATIS</div>
                            <div className="shipping-detail">Llega mañana</div>
                        </div>
                    </div>
                    <div className="shipping-item">
                        <span className="shipping-icon">↩️</span>
                        <div className="shipping-text">
                            <div className="shipping-label">Devolución gratis</div>
                            <div className="shipping-detail">Tienes 30 días desde que lo recibes</div>
                        </div>
                    </div>
                </div>

                <div className="cta-section">
                    <Button onClick={onBuy} variant="primary" fullWidth>
                        Comprar ahora
                    </Button>
                    <Button variant="outline" fullWidth>
                        Agregar al carrito
                    </Button>
                </div>

                <div className="specs-section">
                    <h3 className="specs-title">Características del producto</h3>
                    <div className="specs-list">
                        <div className="spec-item">
                            <span className="spec-label">Material</span>
                            <span className="spec-value">100% Algodón Premium</span>
                        </div>
                        <div className="spec-item">
                            <span className="spec-label">Tallas disponibles</span>
                            <span className="spec-value">S, M, L, XL</span>
                        </div>
                        <div className="spec-item">
                            <span className="spec-label">Color</span>
                            <span className="spec-value">Blanco</span>
                        </div>
                        <div className="spec-item">
                            <span className="spec-label">Cuidado</span>
                            <span className="spec-value">Lavar a máquina, secar a baja temperatura</span>
                        </div>
                    </div>
                </div>

                <div className="description-section">
                    <h3 className="description-title">Descripción</h3>
                    <p className="description-text">
                        {product.name} de alta calidad, diseñada para ofrecer comodidad y estilo.
                        Fabricada con materiales premium y cuidado en cada detalle.
                        Perfecta para uso diario o eventos especiales.
                    </p>
                </div>
            </div>
        </div>
    );
};
