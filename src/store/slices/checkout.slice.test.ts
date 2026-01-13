import { describe, it, expect, beforeEach } from 'vitest';
import checkoutReducer, {
    goToStep,
    setCardData,
    setDeliveryData,
    setCheckoutItems,
    resetCheckout
} from './checkout.slice';

describe('checkoutSlice', () => {
    const initialState = {
        currentStep: 1,
        transactionId: null,
        items: [],
        summaryString: '',
        baseFee: 0,
        deliveryFee: 0,
        totalAmount: 0,
        cardToken: null,
        cardType: null,
        cardLastFour: null,
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        deliveryAddress: '',
        deliveryCity: '',
        deliveryPostalCode: '',
        paymentStatus: null,
        paymentMessage: null,
        paymentReference: null,
        wompiReference: null,
        isProcessing: false,
        error: null,
        lastUpdated: expect.any(Number),
        expiresAt: expect.any(Number)
    };

    it('should return initial state', () => {
        const state = checkoutReducer(undefined, { type: 'unknown' });
        expect(state).toEqual(expect.objectContaining({
            currentStep: 1,
            items: [],
            totalAmount: 0
        }));
    });

    it('should handle goToStep', () => {
        const state = checkoutReducer(undefined, goToStep(2));
        expect(state.currentStep).toBe(2);
    });

    it('should handle setCardData', () => {
        const cardData = { token: 'tok_123', type: 'VISA' as const, lastFour: '4242' };
        const state = checkoutReducer(undefined, setCardData(cardData));
        expect(state.cardToken).toBe('tok_123');
        expect(state.cardType).toBe('VISA');
        expect(state.cardLastFour).toBe('4242');
    });

    it('should handle setDeliveryData', () => {
        const deliveryData = { address: 'Calle 123', city: 'Bogotá', postalCode: '110111' };
        const state = checkoutReducer(undefined, setDeliveryData(deliveryData));
        expect(state.deliveryAddress).toBe('Calle 123');
        expect(state.deliveryCity).toBe('Bogotá');
    });

    it('should handle setCheckoutItems and calculate total', () => {
        const items = [{
            productId: '1',
            quantity: 2,
            price: 100,
            name: 'Test',
            image: 'img.jpg'
        }];
        const state = checkoutReducer(undefined, setCheckoutItems(items));
        expect(state.items).toEqual(items);
        expect(state.totalAmount).toBe(200);
        expect(state.summaryString).toBe('Test');
    });

    it('should handle resetCheckout', () => {
        let state = checkoutReducer(undefined, goToStep(3));
        state = checkoutReducer(state, resetCheckout());
        expect(state.currentStep).toBe(1);
        expect(state.items).toEqual([]);
    });
});
