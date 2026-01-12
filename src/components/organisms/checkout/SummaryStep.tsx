import { useCheckoutFlow } from '../../../hooks/useCheckoutFlow';
import { useAppSelector } from '../../../store/hooks';
import { useState } from 'react';
import { maskCardNumber } from '../../../utils/cardValidation';
import './SummaryStep.css';

export const SummaryStep = () => {
    const { processPayment, checkout } = useCheckoutFlow();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const product = useAppSelector(state =>
        state.products.items.find(p => p.id === checkout.productId)
    );

    const handlePayment = async () => {
        if (isSubmitting || checkout.isProcessing) return;

        setIsSubmitting(true);
        await processPayment();
        setIsSubmitting(false);
    };

    if (!product) {
        return <div>Producto no encontrado</div>;
    }

    const maskedCard = checkout.cardLastFour
        ? maskCardNumber(`************${checkout.cardLastFour}`)
        : '';

    return (
        <div className="summary-step">
            {/* Product Info */}
            <section className="summary-step__section">
                <h3 className="summary-step__title">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                    </svg>
                    Producto
                </h3>
                <div className="summary-step__product">
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="summary-step__product-image"
                    />
                    <div className="summary-step__product-info">
                        <h4>{product.name}</h4>
                        <p className="summary-step__product-price">
                            ${checkout.productAmount.toLocaleString('es-CO')}
                        </p>
                    </div>
                </div>
            </section>

            {/* Cost Breakdown */}
            <section className="summary-step__section">
                <h3 className="summary-step__title">

                    Resumen de Costos
                </h3>
                <div className="summary-step__costs">
                    <div className="summary-step__cost-item">
                        <span>Producto</span>
                        <span>${checkout.productAmount.toLocaleString('es-CO')}</span>
                    </div>
                    <div className="summary-step__cost-item">
                        <span>Tarifa base</span>
                        <span>${checkout.baseFee.toLocaleString('es-CO')}</span>
                    </div>
                    <div className="summary-step__cost-item">
                        <span>Envío</span>
                        <span>${checkout.deliveryFee.toLocaleString('es-CO')}</span>
                    </div>
                    <div className="summary-step__divider"></div>
                    <div className="summary-step__cost-item summary-step__cost-item--total">
                        <span>Total</span>
                        <span>${checkout.totalAmount.toLocaleString('es-CO')}</span>
                    </div>
                </div>
            </section>

            {/* Delivery Info */}
            <section className="summary-step__section">
                <h3 className="summary-step__title">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="1" y="3" width="15" height="13" />
                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                        <circle cx="5.5" cy="18.5" r="2.5" />
                        <circle cx="18.5" cy="18.5" r="2.5" />
                    </svg>
                    Información de Entrega
                </h3>
                <div className="summary-step__info">
                    <div className="summary-step__info-item">
                        <span className="summary-step__info-label">Nombre:</span>
                        <span>{checkout.customerName}</span>
                    </div>
                    <div className="summary-step__info-item">
                        <span className="summary-step__info-label">Email:</span>
                        <span>{checkout.customerEmail}</span>
                    </div>
                    <div className="summary-step__info-item">
                        <span className="summary-step__info-label">Teléfono:</span>
                        <span>{checkout.customerPhone}</span>
                    </div>
                    <div className="summary-step__info-item">
                        <span className="summary-step__info-label">Dirección:</span>
                        <span>{checkout.deliveryAddress}</span>
                    </div>
                    <div className="summary-step__info-item">
                        <span className="summary-step__info-label">Ciudad:</span>
                        <span>{checkout.deliveryCity}</span>
                    </div>
                </div>
            </section>

            {/* Payment Method */}
            <section className="summary-step__section">
                <h3 className="summary-step__title">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                        <line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                    Método de Pago
                </h3>
                <div className="summary-step__payment">
                    <div className="summary-step__card">
                        {checkout.cardType === 'VISA' && (
                            <div className="summary-step__card-logo summary-step__card-logo--visa">
                                VISA
                            </div>
                        )}
                        {checkout.cardType === 'MASTERCARD' && (
                            <div className="summary-step__card-logo summary-step__card-logo--mastercard">
                                MC
                            </div>
                        )}
                        <span className="summary-step__card-number">{maskedCard}</span>
                    </div>
                </div>
            </section>

            {/* Pay Button */}
            <button
                onClick={handlePayment}
                className="summary-step__pay-button"
                disabled={checkout.isProcessing || isSubmitting}
            >
                {checkout.isProcessing || isSubmitting ? (
                    <>
                        <span className="summary-step__spinner"></span>
                        Procesando Pago...
                    </>
                ) : (
                    `Pagar $${checkout.totalAmount.toLocaleString('es-CO')}`
                )}
            </button>

            <p className="summary-step__disclaimer">
                🔒 Tu información está protegida y encriptada
            </p>
        </div>
    );
};
