import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomeView } from './pages/HomeView';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { GlobalLoadingBackdrop } from './components/molecules/GlobalLoadingBackdrop';
import { ScrollToTop } from './components/atoms/ScrollToTop';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { closeCart } from './store/slices/ui.slice';
import { CartDrawer } from './components/organisms/CartDrawer';
import './App.css';

function App() {
    const dispatch = useAppDispatch();
    const { isCartOpen } = useAppSelector((state) => state.ui);

    return (
        <BrowserRouter>
            <ScrollToTop />
            <div className="app-root">
                <GlobalLoadingBackdrop />
                <CartDrawer isOpen={isCartOpen} onClose={() => dispatch(closeCart())} />
                <Routes>
                    <Route path="/" element={<HomeView />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
