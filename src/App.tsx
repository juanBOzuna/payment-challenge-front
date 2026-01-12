import { ProductPage } from './pages/ProductPage';
import { GlobalLoadingBackdrop } from './components/molecules/GlobalLoadingBackdrop';
import './App.css';

function App() {
    return (
        <div className="app-root">
            <GlobalLoadingBackdrop />
            <ProductPage />
        </div>
    );
}

export default App;
