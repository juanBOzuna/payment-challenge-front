import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProducts } from '../store/slices/products.slice';
import { MobileLayout } from '../components/templates/MobileLayout';
import { ProductDetail } from '../components/organisms/ProductDetail';
import './ProductPage.css';

export const ProductPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const { items, status, error } = useAppSelector((state) => state.products);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchProducts());
        }
    }, [dispatch, status]);

    const handleBuy = () => {
        console.log('Initiating Purchase Sequence...');
    };

    if (status === 'loading') {
        return (
            <MobileLayout>
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading Experience...</p>
                </div>
            </MobileLayout>
        );
    }

    if (status === 'failed') {
        return (
            <MobileLayout>
                <div className="error-state">
                    <p>Unable to load product.</p>
                    <button onClick={() => dispatch(fetchProducts())}>Retry Connection</button>
                </div>
            </MobileLayout>
        );
    }

    const featuredProduct = items[0];

    if (!featuredProduct) return null;

    return (
        <MobileLayout>
            <ProductDetail product={featuredProduct} onBuy={handleBuy} />
        </MobileLayout>
    );
};
