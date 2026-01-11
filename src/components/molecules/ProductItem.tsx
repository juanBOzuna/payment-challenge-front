import React from 'react';
import type { Product } from '../../domain/models/Product';
import { Button } from '../atoms/Button';
import './ProductItem.css';

interface ProductItemProps {
    product: Product;
    onSelect: (product: Product) => void;
}

export const ProductItem: React.FC<ProductItemProps> = ({ product, onSelect }) => {
    return (
        <article className="product-card">
            <div className="product-image-container">
                <img src={product.imageUrl} alt={product.name} className="product-image" loading="lazy" />
            </div>
            <div className="product-info">
                <h3 className="product-title">{product.name}</h3>
                <div className="product-meta">
                    <span className="product-price">${product.price.toLocaleString()}</span>
                    <span className="product-stock">{product.stock} units left</span>
                </div>
                <Button onClick={() => onSelect(product)} fullWidth>
                    Buy Now
                </Button>
            </div>
        </article>
    );
};
