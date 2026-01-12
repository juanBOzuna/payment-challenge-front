import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProducts } from '../store/slices/products.slice';
import { useCheckoutFlow } from '../hooks/useCheckoutFlow';
import { MobileLayout } from '../components/templates/MobileLayout';
import { ProductDetail } from '../components/organisms/ProductDetail';
import { CheckoutModal } from '../components/organisms/CheckoutModal';
import './ProductPage.css';

export const ProductPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const { items, status, error } = useAppSelector((state) => state.products);
    const checkout = useAppSelector((state) => state.checkout);
    const { startCheckout } = useCheckoutFlow();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchProducts());
        }
    }, [dispatch, status]);

    // Auto-open modal if checkout is in progress (after page reload)
    useEffect(() => {
        if (checkout.currentStep >= 2 && !isModalOpen) {
            setIsModalOpen(true);
        }
    }, [checkout.currentStep]);

    const handleBuy = (productId: string, productAmount: number, productName: string, imageUrl: string) => {
        // If checkout is already in progress, just reopen the modal
        if (checkout.currentStep >= 2) {
            setIsModalOpen(true);
        } else {
            // Otherwise, start a new checkout
            startCheckout(productId, productAmount, productName, imageUrl);
            setIsModalOpen(true);
        }
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

    // Focus on Single Product (The first one, as per requirements implied)
    const featuredProduct = items[0];

    if (!featuredProduct) return null;

    return (
        <MobileLayout>
            <ProductDetail
                product={featuredProduct}
                onBuy={() => handleBuy(featuredProduct.id, featuredProduct.price, featuredProduct.name, featuredProduct.imageUrl)}
            />
            <CheckoutModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </MobileLayout>
    );
};
