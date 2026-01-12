import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { useCheckoutFlow } from '../hooks/useCheckoutFlow';
import { Header } from '../components/organisms/Header';
import { ProductDetail } from '../components/organisms/ProductDetail';
import { CheckoutModal } from '../components/organisms/CheckoutModal';
import { fetchProducts } from '../store/slices/products.slice';
import './ProductPage.css'; // Reusing existing styles if applicable, or I can creating ProductDetailPage.css

export const ProductDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // We need products to be loaded to find the current one.
    // In a real app we might fetch just one, but here we keep simple store.
    const { items, status } = useAppSelector((state) => state.products);
    const checkout = useAppSelector((state) => state.checkout);
    const { startCheckout } = useCheckoutFlow();

    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchProducts());
        }
    }, [dispatch, status]);

    const product = items.find(p => p.id === id);

    // Sync checkout state with modal
    // If checkout step progresses and modal is closed, open it? 
    // Actually the previous logic was: if step >= 2, open modal.
    useEffect(() => {
        if (checkout.currentStep >= 2 && !isModalOpen) {
            setIsModalOpen(true);
        }
    }, [checkout.currentStep]);

    const handleBuy = () => {
        if (!product) return;

        if (checkout.currentStep >= 2) {
            setIsModalOpen(true);
        } else {
            startCheckout(product.id, product.price, product.name, product.imageUrl);
            setIsModalOpen(true);
        }
    };

    if (status === 'loading') {
        return <div>Loading...</div>; // Simplification, can use global loader
    }

    if (!product) {
        return (
            <div>
                <Header />
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <h2>Producto no encontrado</h2>
                    <button onClick={() => navigate('/')}>Volver al inicio</button>
                </div>
            </div>
        );
    }

    return (
        <div className="product-detail-page">
            <Header />
            <main>
                <ProductDetail
                    product={product}
                    onBuy={handleBuy}
                />
            </main>

            <CheckoutModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};
