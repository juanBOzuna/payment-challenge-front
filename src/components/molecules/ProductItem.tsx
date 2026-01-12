import React from 'react';
import type { Product } from '../../domain/models/Product';
import './ProductItem.css';

interface ProductItemProps {
    product: Product;
    onSelect: (product: Product) => void;
}

export const ProductItem: React.FC<ProductItemProps> = ({ product, onSelect }) => {
    // Handler for the entire card click
    const handleCardClick = () => {
        onSelect(product);
    };

    return (
        <article className="product-card" onClick={handleCardClick}>
            <div className="product-image-container">
                <img src={product.imageUrl} alt={product.name} className="product-image" loading="lazy" />
            </div>
            <div className="product-info">
                <div className="product-meta">
                    <span className="product-price">${product.price.toLocaleString()}</span>
                </div>
                <h3 className="product-title">{product.name}</h3>
                <div className="product-footer">
                    <span className="action-link">
                        Ver Detalles
                    </span>
                    <div className="cart-btn" aria-label="Agregar al carrito" onClick={(e) => {
                        e.stopPropagation();
                        onSelect(product);
                    }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                    </div>
                </div>
            </div>
        </article>
    );
};
