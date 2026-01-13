import { useEffect, useRef, useCallback } from 'react';

interface PollingPhase {
    interval: number;
    duration: number;
    message: string;
}

const POLLING_PHASES: PollingPhase[] = [
    { interval: 1000, duration: 10000, message: "Procesando tu pago..." },
    { interval: 2000, duration: 20000, message: "Tu banco está validando la transacción..." },
    { interval: 5000, duration: 30000, message: "Esto está tardando más de lo usual..." }
];

interface UseAdaptivePollingOptions {
    transactionId: string | null;
    onStatusChange: (status: 'APPROVED' | 'DECLINED' | 'ERROR' | 'PENDING') => void;
    enabled: boolean;
}

interface UseAdaptivePollingReturn {
    phase: number | null;
    message: string;
    isPolling: boolean;
    stopPolling: () => void;
}

export const useAdaptivePolling = ({
    transactionId,
    onStatusChange,
    enabled
}: UseAdaptivePollingOptions): UseAdaptivePollingReturn => {
    const intervalRef = useRef<number | null>(null);
    const phaseRef = useRef<number>(0);
    const startTimeRef = useRef<number>(0);
    const elapsedRef = useRef<number>(0);
    const isPollingRef = useRef<boolean>(false);

    const stopPolling = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        isPollingRef.current = false;
        phaseRef.current = 0;
    }, []);

    const checkStatus = useCallback(async () => {
        if (!transactionId) return;

        try {
            console.log('[POLLING] Checking transaction status:', transactionId);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/transactions/${transactionId}/status`);
            const data = await response.json();

            console.log('[POLLING] Received status:', data.status);

            if (data.status !== 'PENDING') {
                console.log('[POLLING] Status changed from PENDING to:', data.status);
                stopPolling();
                onStatusChange(data.status);
            }
        } catch (error) {
            console.error('[POLLING] Error:', error);
        }
    }, [transactionId, onStatusChange, stopPolling]);

    const startPhase = useCallback((phaseIndex: number) => {
        if (phaseIndex >= POLLING_PHASES.length) {
            stopPolling();
            return;
        }

        const phase = POLLING_PHASES[phaseIndex];
        phaseRef.current = phaseIndex;

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        intervalRef.current = setInterval(checkStatus, phase.interval);

        setTimeout(() => {
            if (isPollingRef.current) {
                startPhase(phaseIndex + 1);
            }
        }, phase.duration);
    }, [checkStatus, stopPolling]);

    useEffect(() => {
        if (enabled && transactionId && !isPollingRef.current) {
            isPollingRef.current = true;
            startTimeRef.current = Date.now();
            elapsedRef.current = 0;
            startPhase(0);
        }

        return () => {
            stopPolling();
        };
    }, [enabled, transactionId, startPhase, stopPolling]);

    const currentMessage = phaseRef.current < POLLING_PHASES.length
        ? POLLING_PHASES[phaseRef.current].message
        : "Tu pago está siendo procesado. Recibirás un email con el resultado.";

    return {
        phase: isPollingRef.current ? phaseRef.current : null,
        message: currentMessage,
        isPolling: isPollingRef.current,
        stopPolling
    };
};
