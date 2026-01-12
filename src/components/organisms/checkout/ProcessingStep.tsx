import { useCheckoutFlow } from '../../../hooks/useCheckoutFlow';
import { useAdaptivePolling } from '../../../hooks/useAdaptivePolling';
import './ProcessingStep.css';

export const ProcessingStep = () => {
    const { checkout, handleStatusChange } = useCheckoutFlow();

    const { phase, message } = useAdaptivePolling({
        transactionId: checkout.transactionId,
        onStatusChange: handleStatusChange,
        enabled: checkout.paymentStatus === 'PENDING'
    });

    const getPhaseClass = () => {
        if (phase === null) return '';
        if (phase === 0) return 'phase-1';
        if (phase === 1) return 'phase-2';
        return 'phase-3';
    };

    return (
        <div className={`processing-step ${getPhaseClass()}`}>
            <div className="processing-step__content">
                {/* Show spinner if phase is active OR if we are just initialized (phase null but component mounted) */}
                {(phase === null || phase < 3) ? (
                    <div className="processing-step__spinner">
                        <div className="spinner"></div>
                    </div>
                ) : (
                    <div className="processing-step__progress">
                        <div className="progress-bar">
                            <div className="progress-fill"></div>
                        </div>
                    </div>
                )}

                <h2 className="processing-step__title">
                    Pago Pendiente
                </h2>

                <p className="processing-step__message">{message}</p>

                {phase !== null && phase >= 2 && (
                    <p className="processing-step__note">
                        Si el proceso tarda demasiado, recibirás un email con el resultado.
                    </p>
                )}
            </div>
        </div>
    );
};
