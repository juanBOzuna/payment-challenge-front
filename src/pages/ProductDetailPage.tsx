import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { useCheckoutFlow } from '../hooks/useCheckoutFlow';
import { Header } from '../components/organisms/Header';
import { ProductDetail } from '../components/organisms/ProductDetail';
import { fetchProducts, fetchProductBySlug } from '../store/slices/products.slice';
import { addToCart } from '../store/slices/cart.slice';
import { openCart } from '../store/slices/ui.slice';
import './ProductPage.css';

export const ProductDetailPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();


    const { items, status } = useAppSelector((state) => state.products);
    const { startCheckout } = useCheckoutFlow();

    // Try to find product in current state
    const product = items.find(p => p.slug === slug);

    useEffect(() => {
        if (!product && slug) {
            dispatch(fetchProductBySlug(slug));
        } else if (status === 'idle') {
            dispatch(fetchProducts());
        }
    }, [dispatch, slug, product, status]);

    const handleBuy = (quantity: number) => {
        if (!product) return;
        startCheckout([{
            productId: product.id,
            quantity,
            price: product.price,
            name: product.name,
            image: product.imageUrl
        }]);
    };

    const handleAddToCart = (quantity: number) => {
        if (!product) return;
        dispatch(addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            quantity
        }));
        dispatch(openCart());
    };

    if (status === 'loading') {
        return <div>Loading...</div>;
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
                    onAddToCart={handleAddToCart}
                />
            </main>
        </div>
    );
};
