import { useCheckoutFlow } from '../../../hooks/useCheckoutFlow';
import './StatusStep.css';

interface StatusStepProps {
    onClose: () => void;
}

export const StatusStep = ({ onClose }: StatusStepProps) => {
    const { checkout, returnToProducts } = useCheckoutFlow();

    const handleReturn = () => {
        returnToProducts();
        onClose();
    };

    if (checkout.isProcessing) {
        return (
            <div className="status-step status-step--processing">
                <div className="spinner"></div>
                <h2 className="status-step__title">Procesando Pago...</h2>
                <p className="status-step__message">Por favor espera un momento, no cierres esta ventana.</p>
            </div>
        );
    }

    if (checkout.paymentStatus === 'APPROVED') {
        return (
            <div className="status-step status-step--success">
                <div className="status-step__icon status-step__icon--success">
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                        <circle cx="32" cy="32" r="32" fill="#10B981" />
                        <path d="M20 32L28 40L44 24" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>

                <h2 className="status-step__title">¡Pago Exitoso!</h2>

                <p className="status-step__message">
                    Tu pago ha sido procesado correctamente. Recibirás un email de confirmación en breve.
                </p>

                {checkout.wompiReference && (
                    <div className="status-step__reference">
                        <span className="status-step__reference-label">Referencia:</span>
                        <span className="status-step__reference-value">{checkout.wompiReference}</span>
                    </div>
                )}

                <div className="status-step__details">
                    <div className="status-step__detail-item">
                        <span className="status-step__detail-label">Monto pagado:</span>
                        <span className="status-step__detail-value">
                            ${checkout.totalAmount.toLocaleString('es-CO')}
                        </span>
                    </div>
                    <div className="status-step__detail-item">
                        <span className="status-step__detail-label">Método de pago:</span>
                        <span className="status-step__detail-value">
                            {checkout.cardType} **** {checkout.cardLastFour}
                        </span>
                    </div>
                </div>

                <button
                    onClick={handleReturn}
                    className="status-step__button status-step__button--success"
                >
                    Volver a Productos
                </button>
            </div>
        );
    }

    if (checkout.paymentStatus === 'DECLINED') {
        return (
            <div className="status-step status-step--declined">
                <div className="status-step__icon status-step__icon--error">
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                        <circle cx="32" cy="32" r="32" fill="#EF4444" />
                        <path d="M24 24L40 40M40 24L24 40" stroke="white" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                </div>

                <h2 className="status-step__title">Pago Rechazado</h2>

                <p className="status-step__message">
                    {checkout.paymentMessage || 'Tu pago no pudo ser procesado. Por favor, verifica los datos de tu tarjeta e intenta nuevamente.'}
                </p>

                <div className="status-step__suggestions">
                    <h4>Posibles causas:</h4>
                    <ul>
                        <li>Fondos insuficientes</li>
                        <li>Datos de tarjeta incorrectos</li>
                        <li>Tarjeta vencida o bloqueada</li>
                        <li>Límite de transacciones excedido</li>
                    </ul>
                </div>

                <button
                    onClick={handleReturn}
                    className="status-step__button status-step__button--error"
                >
                    Volver a Intentar
                </button>
            </div>
        );
    }

    // ERROR state
    return (
        <div className="status-step status-step--error">
            <div className="status-step__icon status-step__icon--warning">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                    <circle cx="32" cy="32" r="32" fill="#F59E0B" />
                    <path d="M32 20V36M32 44V44.01" stroke="white" strokeWidth="4" strokeLinecap="round" />
                </svg>
            </div>

            <h2 className="status-step__title">Error en el Pago</h2>

            <p className="status-step__message">
                {checkout.paymentMessage || 'Ocurrió un error al procesar tu pago. Por favor, intenta nuevamente más tarde.'}
            </p>

            <div className="status-step__error-details">
                <p>Si el problema persiste, contacta a nuestro soporte.</p>
            </div>

            <button
                onClick={handleReturn}
                className="status-step__button status-step__button--warning"
            >
                Volver
            </button>
        </div>
    );
};
