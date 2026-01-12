import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProducts } from '../store/slices/products.slice';
import { Header } from '../components/organisms/Header';
import { ProductItem } from '../components/molecules/ProductItem';
import './HomeView.css';
import type { Product } from '../domain/models/Product';

export const HomeView: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { items, status } = useAppSelector((state) => state.products);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchProducts());
        }
    }, [dispatch, status]);

    const handleProductSelect = (product: Product) => {
        navigate(`/product/${product.id}`);
    };

    if (status === 'loading') {
        return (
            <div className="loading-state">
                <Header />
                <div className="spinner-container">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    if (status === 'failed') {
        return (
            <div className="error-state">
                <Header />
                <div className="error-content">
                    <p>Unable to load products.</p>
                    <button onClick={() => dispatch(fetchProducts())}>Retry</button>
                </div>
            </div>
        );
    }

    return (
        <div className="home-view">
            <Header />
            <section className="hero-banner">
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1 className="hero-title">
                        <Link to="/">LinkBox Shop</Link>
                    </h1>
                    <p className="hero-subtitle">Tu estilo, tu tecnología, tu seguridad.</p>
                    <span className="hero-trust-label">Envíos a todo el país</span>
                </div>
                <img src="/persona_card.png" alt="Happy Shopper" className="hero-mobile-image" />
            </section>
            <main className="home-content">
                <div className="product-grid">
                    {items.map((product) => (
                        <ProductItem
                            key={product.id}
                            product={product}
                            onSelect={handleProductSelect}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
};
