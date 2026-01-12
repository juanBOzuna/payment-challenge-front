import { useEffect } from 'react';
import { useCheckoutFlow } from '../../hooks/useCheckoutFlow';
import { CardDeliveryStep } from './checkout/CardDeliveryStep';
import { SummaryStep } from './checkout/SummaryStep';
import { ProcessingStep } from './checkout/ProcessingStep';
import { StatusStep } from './checkout/StatusStep';
import './CheckoutModal.css';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CheckoutModal = ({ isOpen, onClose }: CheckoutModalProps) => {
    const { checkout, goBack, returnToProducts } = useCheckoutFlow();

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                handleClose();
            }
        };

        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleClose = () => {
        if (checkout.currentStep === 4) {
            returnToProducts();
        }
        onClose();
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    if (!isOpen) return null;

    const showBackButton = checkout.currentStep === 3 && !checkout.isProcessing;
    const showCloseButton = checkout.currentStep !== 4 && checkout.currentStep !== 3.5;

    return (
        <div className="checkout-modal" onClick={handleBackdropClick}>
            <div className="checkout-modal__content">
                <div className="checkout-modal__header">
                    <div className="checkout-modal__steps">
                        {[1, 2, 3, 4, 5].map((step) => (
                            <div
                                key={step}
                                className={`checkout-modal__step ${step === Math.floor(checkout.currentStep) ? 'checkout-modal__step--active' : ''
                                    } ${step < checkout.currentStep ? 'checkout-modal__step--completed' : ''}`}
                            >
                                {step < checkout.currentStep ? '✓' : step}
                            </div>
                        ))}
                    </div>
                    {showCloseButton && (
                        <button
                            className="checkout-modal__close"
                            onClick={handleClose}
                            aria-label="Cerrar"
                        >
                            ✕
                        </button>
                    )}
                </div>

                <div className="checkout-modal__body">
                    {checkout.error && (
                        <div className="checkout-modal__error">
                            <span className="checkout-modal__error-icon">⚠️</span>
                            {checkout.error}
                        </div>
                    )}

                    {checkout.currentStep === 2 && <CardDeliveryStep />}
                    {checkout.currentStep === 3 && <SummaryStep />}
                    {checkout.currentStep === 3.5 && <ProcessingStep />}
                    {checkout.currentStep === 4 && <StatusStep onClose={handleClose} />}
                </div>

                {/* Footer */}
                {showBackButton && (
                    <div className="checkout-modal__footer">
                        <button
                            className="checkout-modal__button checkout-modal__button--secondary"
                            onClick={goBack}
                            disabled={checkout.isProcessing}
                        >
                            ← Atrás
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
