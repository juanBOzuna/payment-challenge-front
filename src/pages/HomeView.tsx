import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProducts, setPage, setSearch, setCategory, resetFilters } from '../store/slices/products.slice';
import { Header } from '../components/organisms/Header';
import { ProductItem } from '../components/molecules/ProductItem';
import './HomeView.css';
import type { Product } from '../domain/models/Product';

export const HomeView: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { items, status, filters, meta } = useAppSelector((state) => state.products);

    
    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch, filters]); 

    const handleProductSelect = (product: Product) => {
        navigate(`/product/${product.id}`);
    };

    const handlePageChange = (newPage: number) => {
        dispatch(setPage(newPage));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };



    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const term = formData.get('search') as string;
        dispatch(setSearch(term));
    };

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

            <main className="home-main-layout">
                <aside className="sidebar">
                    <div className="sidebar-sticky">
                        <h3>Filtros</h3>
                        <form onSubmit={handleSearchSubmit} className="search-form">
                            <input
                                name="search"
                                type="text"
                                placeholder="Buscar..."
                                defaultValue={filters.search}
                                className="search-input"
                            />
                            <button type="submit" className="search-btn" aria-label="Buscar">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                            </button>
                        </form>

                        <div className="category-list">
                            <h4>Categorías</h4>
                            <ul>
                                <li className={filters.categoryId === '' ? 'active' : ''}
                                    onClick={() => dispatch(setCategory(''))}>
                                    Todas
                                </li>
                                {/* Categories should ideally come from API, hardcoded for now or fetch categories too */}
                                <li className={filters.categoryId === 'clothing' ? 'active' : ''} 
                                    onClick={() => dispatch(setCategory('clothing'))}>
                                    Ropa
                                </li>
                                <li className={filters.categoryId === 'footwear' ? 'active' : ''}
                                    onClick={() => dispatch(setCategory('footwear'))}>
                                    Calzado
                                </li>
                            </ul>
                        </div>
                        {/* Clear Filters */}
                        {(filters.search || filters.categoryId) && (
                            <button onClick={() => dispatch(resetFilters())} className="reset-filters-btn">
                                Limpiar Filtros
                            </button>
                        )}
                    </div>
                </aside>

                <div className="content-area">
                    {status === 'loading' && <div className="spinner"></div>}

                    {status === 'failed' && (
                        <div className="error-message">
                            <p>Error cargando productos.</p>
                            <button onClick={() => dispatch(fetchProducts())}>Reintentar</button>
                        </div>
                    )}

                    {status === 'succeeded' && items.length === 0 && (
                        <div className="no-results">
                            <p>No se encontraron productos.</p>
                        </div>
                    )}

                    <div className="product-grid">
                        {items.map((product) => (
                            <ProductItem
                                key={product.id}
                                product={product}
                                onSelect={handleProductSelect}
                            />
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {meta.total > 0 && (
                        <div className="pagination">
                            <button
                                disabled={meta.page === 1}
                                onClick={() => handlePageChange(meta.page - 1)}
                            >
                                &laquo; Anterior
                            </button>
                            <span className="page-info">
                                Página {meta.page} de {meta.totalPages}
                            </span>
                            <button
                                disabled={meta.page === meta.totalPages}
                                onClick={() => handlePageChange(meta.page + 1)}
                            >
                                Siguiente &raquo;
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};
