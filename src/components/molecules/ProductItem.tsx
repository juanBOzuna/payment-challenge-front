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
                <h3 className="product-title">{product.name}</h3>
                <div className="product-meta">
                    <span className="product-price">${product.price.toLocaleString()}</span>
                </div>
                <div className="product-footer">
                    <span className="action-text">Comprar &rarr;</span>
                </div>
            </div>
        </article>
    );
};
