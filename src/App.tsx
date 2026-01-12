import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomeView } from './pages/HomeView';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { GlobalLoadingBackdrop } from './components/molecules/GlobalLoadingBackdrop';
import './App.css';

function App() {
    return (
        <BrowserRouter>
            <div className="app-root">
                <GlobalLoadingBackdrop />
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
