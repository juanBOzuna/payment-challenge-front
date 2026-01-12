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
    // RESTORATION LOGIC: If we have an active checkout for THIS product (step > 1), ensure modal is open.
    useEffect(() => {
        // Condition: Active Step (>1) AND Matching Product AND Modal Closed
        if ((checkout.currentStep > 1 || checkout.isProcessing) && checkout.productId === product?.id && !isModalOpen) {
            setIsModalOpen(true);
        }
    }, [checkout.currentStep, checkout.productId, product?.id, checkout.isProcessing]);

    const handleBuy = () => {
        if (!product) return;

        // Only resume if it's the same product and we are not in a terminal state (Step 4/5)
        // Actually, for simplicity and to address the user's issue of "skipping step 2",
        // it's safer to check if productId matches. 
        if (checkout.currentStep >= 2 && checkout.productId === product.id && checkout.currentStep < 4) {
            setIsModalOpen(true);
        } else {
            // Start fresh
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
