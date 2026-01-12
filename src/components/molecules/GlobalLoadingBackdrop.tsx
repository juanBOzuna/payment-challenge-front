import { useAppSelector } from '../../store/hooks';
import './GlobalLoadingBackdrop.css';

export const GlobalLoadingBackdrop = () => {
    const isProcessing = useAppSelector(state => state.checkout.isProcessing);

    if (!isProcessing) return null;

    return (
        <div className="loading-backdrop">
            <div className="loading-backdrop__content">
                <div className="loading-backdrop__spinner"></div>
                <p>Procesando...</p>
            </div>
        </div>
    );
};
