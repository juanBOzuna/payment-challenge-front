import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { HomeView } from './pages/HomeView';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { GlobalLoadingBackdrop } from './components/molecules/GlobalLoadingBackdrop';
import { ScrollToTop } from './components/atoms/ScrollToTop';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { closeCart } from './store/slices/ui.slice';
import { CartDrawer } from './components/organisms/CartDrawer';
import './App.css';

import { CheckoutModal } from './components/organisms/CheckoutModal';
import { closeCheckout } from './store/slices/ui.slice';
import { useCheckoutFlow } from './hooks/useCheckoutFlow';

function App() {
    const dispatch = useAppDispatch();
    const { isCartOpen, isCheckoutOpen } = useAppSelector((state) => state.ui);
    const checkout = useAppSelector((state) => state.checkout);
    const { recoverPaymentState } = useCheckoutFlow();

   
    useEffect(() => {
        recoverPaymentState();
    }, []);

   
    const finalIsOpen = isCheckoutOpen ||
        checkout.isProcessing ||
        checkout.paymentStatus === 'PENDING' ||
        checkout.currentStep === 4;

    return (
        <BrowserRouter>
            <ScrollToTop />
            <div className="app-root">
                <GlobalLoadingBackdrop />
                <CartDrawer isOpen={isCartOpen} onClose={() => dispatch(closeCart())} />

                <CheckoutModal
                    isOpen={finalIsOpen}
                    onClose={() => dispatch(closeCheckout())}
                />

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
