import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
    setProductData,
    setCardData,
    setCustomerData,
    setDeliveryData,
    setTransactionId,
    setPaymentResult,
    setProcessing,
    setError,
    goToStep,
    resetCheckout,
} from '../store/slices/checkout.slice';
import { paymentService } from '../infrastructure/api/payment.service';
import { wompiService } from '../infrastructure/api/wompi.service';
import {
    detectCardType,
    validateCardNumber,
    validateExpiryDate,
    validateCVC,
    validateCardHolder,
    getLastFourDigits,
} from '../utils/cardValidation';

export interface CardDeliveryData {
    cardNumber: string;
    cvc: string;
    expiryMonth: string;
    expiryYear: string;
    cardHolder: string;

    name: string;
    email: string;
    phone: string;

    address: string;
    city: string;
    postalCode: string;
}

/**
 * useCheckoutFlow - Railway Oriented Programming Hook
 * 
 * Orchestrates the entire payment flow using ROP pattern with Result<T>
 * Each step can fail, and errors are propagated through the railway
 */
export const useCheckoutFlow = () => {
    const dispatch = useAppDispatch();
    const checkout = useAppSelector(state => state.checkout);

    /**
     * Step 1: Start checkout from product page
     */
    const startCheckout = (productId: string, productAmount: number, productName: string, productImage: string) => {
        dispatch(resetCheckout());
        dispatch(setProductData({ productId, productAmount, productName, productImage }));
        dispatch(goToStep(2));
    };

    /**
     * Step 2: Submit card and delivery information
     * Railway: Validate → Tokenize → Save data → Go to summary
     */
    const submitCardAndDelivery = async (data: CardDeliveryData): Promise<void> => {
        try {
            dispatch(setProcessing(true));
            dispatch(setError(null));

            const validationResult = validateInputs(data);
            if (validationResult.isFailure) {
                dispatch(setError(validationResult.error!));
                return;
            }

            const tokenResult = await wompiService.tokenizeCard({
                number: data.cardNumber.replace(/\s/g, ''),
                cvc: data.cvc,
                exp_month: data.expiryMonth,
                exp_year: data.expiryYear,
                card_holder: data.cardHolder,
            });

            if (tokenResult.isFailure) {
                dispatch(setError(tokenResult.error!));
                return;
            }

            const cardToken = tokenResult.getValue();
            const cardType = detectCardType(data.cardNumber);
            const lastFour = getLastFourDigits(data.cardNumber);

            dispatch(setCardData({
                token: cardToken.id,
                type: cardType,
                lastFour,
            }));

            dispatch(setCustomerData({
                name: data.name,
                email: data.email,
                phone: data.phone,
            }));

            dispatch(setDeliveryData({
                address: data.address,
                city: data.city,
                postalCode: data.postalCode,
            }));

            dispatch(goToStep(3));

        } catch (error) {
            dispatch(setError(error instanceof Error ? error.message : 'Unknown error'));
        } finally {
            dispatch(setProcessing(false));
        }
    };

    /**
     * Step 3: Process payment
     * Railway: Create customer → Create transaction → Get acceptance token → Process payment → Update stock
     */
    const processPayment = async (): Promise<void> => {
        try {
            dispatch(setProcessing(true));
            // Persistence Fix: Save PENDING status immediately so reload recovers correctly
            dispatch(setPaymentResult({ status: 'PENDING', message: null, reference: null }));
            dispatch(setError(null));

            const customerResult = await paymentService.createCustomer({
                name: checkout.customerName,
                email: checkout.customerEmail,
                phone: checkout.customerPhone,
            });

            if (customerResult.isFailure) {
                dispatch(setPaymentResult({
                    status: 'ERROR',
                    message: customerResult.error!,
                    reference: null,
                }));
                dispatch(goToStep(4));
                return;
            }

            const customer = customerResult.getValue();

            const transactionResult = await paymentService.createTransaction({
                productId: checkout.productId!,
                customerId: customer.customerId,
                productAmount: checkout.productAmount,
            });

            if (transactionResult.isFailure) {
                dispatch(setPaymentResult({
                    status: 'ERROR',
                    message: transactionResult.error!,
                    reference: null,
                }));
                dispatch(goToStep(4));
                return;
            }

            const transaction = transactionResult.getValue();
            dispatch(setTransactionId(transaction.transactionId));

            // CRITICAL FIX: Go to Processing Step IMMEDIATELY after transaction creation.
            // This ensures that if the user reloads while we get the token or process payment,
            // they land on the Polling screen which can recover the status.
            dispatch(goToStep(3.5));

            const acceptanceResult = await paymentService.getAcceptanceToken();

            if (acceptanceResult.isFailure) {
                dispatch(setPaymentResult({
                    status: 'ERROR',
                    message: acceptanceResult.error!,
                    reference: null,
                }));
                dispatch(goToStep(4));
                return;
            }

            const { acceptanceToken } = acceptanceResult.getValue();

            const paymentResult = await paymentService.processPayment(
                transaction.transactionId,
                {
                    cardToken: checkout.cardToken!,
                    acceptanceToken,
                    customerEmail: checkout.customerEmail,
                    deliveryAddress: checkout.deliveryAddress,
                    deliveryCity: checkout.deliveryCity,
                    deliveryPostalCode: checkout.deliveryPostalCode,
                }
            );

            if (paymentResult.isFailure) {
                const isDeclined = paymentResult.error!.toLowerCase().includes('declineda') ||
                    paymentResult.error!.toLowerCase().includes('insufficient') ||
                    paymentResult.error!.toLowerCase().includes('fondos') ||
                    paymentResult.error!.toLowerCase().includes('rechazada') ||
                    paymentResult.error!.toLowerCase().includes('declined');

                dispatch(setPaymentResult({
                    status: isDeclined ? 'DECLINED' : 'ERROR',
                    message: paymentResult.error!,
                    reference: null,
                }));
                dispatch(goToStep(4));
                return;
            }

            const result = paymentResult.getValue();

            if (result.status === 'PENDING') {
                dispatch(setPaymentResult({
                    status: 'PENDING',
                    message: null,
                    reference: result.wompiReference || null,
                }));
                // Already on 3.5, just stay there and let polling handle completion if needed
                return;
            }

            dispatch(setPaymentResult({
                status: result.status,
                message: result.message || null,
                reference: result.wompiReference || null,
            }));

            dispatch(goToStep(4));

        } catch (error) {
            dispatch(setPaymentResult({
                status: 'ERROR',
                message: error instanceof Error ? error.message : 'Unknown error',
                reference: null,
            }));
            dispatch(goToStep(4));
        } finally {
            dispatch(setProcessing(false));
        }
    };

    const handleStatusChange = (status: 'APPROVED' | 'DECLINED' | 'ERROR' | 'PENDING') => {
        if (status === 'PENDING') return;

        dispatch(setPaymentResult({
            status,
            message: status === 'DECLINED' ? 'Transacción rechazada por el banco' : null,
            reference: checkout.paymentReference,
        }));
        dispatch(goToStep(4));
    };

    /**
     * Return to products page and reset checkout
     */
    const returnToProducts = () => {
        dispatch(resetCheckout());
        dispatch(goToStep(1));
    };

    /**
     * Go back to previous step
     */
    const goBack = () => {
        if (checkout.currentStep === 3) {
            dispatch(goToStep(2));
        }
    };

    return {
        checkout,
        startCheckout,
        submitCardAndDelivery,
        processPayment,
        handleStatusChange,
        returnToProducts,
        goBack,
    };
};

/**
 * Validate all inputs before tokenization
 * Returns Result<void> for ROP pattern
 */
function validateInputs(data: CardDeliveryData): { isFailure: boolean; error?: string } {
    if (!validateCardNumber(data.cardNumber)) {
        return { isFailure: true, error: 'Número de tarjeta inválido' };
    }

    if (!validateExpiryDate(`${data.expiryMonth}/${data.expiryYear}`)) {
        return { isFailure: true, error: 'Fecha de expiración inválida' };
    }

    if (!validateCVC(data.cvc)) {
        return { isFailure: true, error: 'CVC inválido' };
    }

    if (!validateCardHolder(data.cardHolder)) {
        return { isFailure: true, error: 'Nombre del titular inválido' };
    }

    if (!data.name || data.name.trim().length < 3) {
        return { isFailure: true, error: 'Nombre debe tener al menos 3 caracteres' };
    }

    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        return { isFailure: true, error: 'Email inválido' };
    }

    if (!data.phone || data.phone.length < 10) {
        return { isFailure: true, error: 'Teléfono inválido' };
    }

    if (!data.address || data.address.trim().length < 10) {
        return { isFailure: true, error: 'Dirección debe tener al menos 10 caracteres' };
    }

    if (!data.city || data.city.trim().length < 3) {
        return { isFailure: true, error: 'Ciudad inválida' };
    }

    return { isFailure: false };
}
