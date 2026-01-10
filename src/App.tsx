import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { fetchProducts } from './store/slices/products.slice';
import './App.css';

function App() {
    const dispatch = useAppDispatch();
    const { items, status, error } = useAppSelector((state) => state.products);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    return (
        <div className="app-container">
            <h1>Payment Challenge</h1>
            <p>Status: {status}</p>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}

            <div className="product-grid">
                {items.map((product) => (
                    <div key={product.id} className="product-preview">
                        <h3>{product.name}</h3>
                        <p>${product.price}</p>
                        <p>Stock: {product.stock}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
