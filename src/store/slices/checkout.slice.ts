import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type CheckoutStep = 1 | 2 | 3 | 3.5 | 4 | 5;
export type PaymentStatus = 'PENDING' | 'APPROVED' | 'DECLINED' | 'ERROR' | null;
export type CardType = 'VISA' | 'MASTERCARD' | null;

export interface CheckoutState {
    currentStep: CheckoutStep;

    transactionId: string | null;
    productId: string | null;
    productName: string | null;
    productImage: string | null;
    productAmount: number;
    baseFee: number;
    deliveryFee: number;
    totalAmount: number;

    cardToken: string | null;
    cardType: CardType;
    cardLastFour: string | null;

    customerName: string;
    customerEmail: string;
    customerPhone: string;

    deliveryAddress: string;
    deliveryCity: string;
    deliveryPostalCode: string;

    paymentStatus: PaymentStatus;
    paymentMessage: string | null;
    paymentReference: string | null;
    wompiReference: string | null;

    isProcessing: boolean;
    error: string | null;

    lastUpdated: number;
    expiresAt: number;
}

const EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 hours

const initialState: CheckoutState = {
    currentStep: 1,
    transactionId: null,
    productId: null,
    productName: null,
    productImage: null,
    productAmount: 0,
    baseFee: 5000,
    deliveryFee: 10000,
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
    lastUpdated: Date.now(),
    expiresAt: Date.now() + EXPIRATION_TIME
};

const checkoutSlice = createSlice({
    name: 'checkout',
    initialState,
    reducers: {
        // Navigation
        goToStep: (state, action: PayloadAction<CheckoutStep>) => {
            state.currentStep = action.payload;
            state.lastUpdated = Date.now();
        },

        nextStep: (state) => {
            if (state.currentStep < 5) {
                state.currentStep = (state.currentStep + 1) as CheckoutStep;
                state.lastUpdated = Date.now();
            }
        },

        previousStep: (state) => {
            if (state.currentStep > 1) {
                state.currentStep = (state.currentStep - 1) as CheckoutStep;
                state.lastUpdated = Date.now();
            }
        },

        resetCheckout: (state) => {
            Object.assign(state, {
                ...initialState,
                lastUpdated: Date.now(),
                expiresAt: Date.now() + EXPIRATION_TIME
            });
        },

        // Data updates
        setProductData: (state, action: PayloadAction<{ productId: string; productAmount: number; productName: string; productImage: string }>) => {
            state.productId = action.payload.productId;
            state.productAmount = action.payload.productAmount;
            state.productName = action.payload.productName;
            state.productImage = action.payload.productImage;
            state.totalAmount = action.payload.productAmount + state.baseFee + state.deliveryFee;
            state.lastUpdated = Date.now();
        },

        setCardData: (state, action: PayloadAction<{ token: string; type: CardType; lastFour: string }>) => {
            state.cardToken = action.payload.token;
            state.cardType = action.payload.type;
            state.cardLastFour = action.payload.lastFour;
            state.lastUpdated = Date.now();
        },

        setCustomerData: (state, action: PayloadAction<{ name: string; email: string; phone: string }>) => {
            state.customerName = action.payload.name;
            state.customerEmail = action.payload.email;
            state.customerPhone = action.payload.phone;
            state.lastUpdated = Date.now();
        },

        setDeliveryData: (state, action: PayloadAction<{ address: string; city: string; postalCode: string }>) => {
            state.deliveryAddress = action.payload.address;
            state.deliveryCity = action.payload.city;
            state.deliveryPostalCode = action.payload.postalCode;
            state.lastUpdated = Date.now();
        },

        setTransactionId: (state, action: PayloadAction<string>) => {
            state.transactionId = action.payload;
            state.lastUpdated = Date.now();
        },

        setPaymentResult: (state, action: PayloadAction<{
            status: PaymentStatus;
            message: string | null;
            reference: string | null
        }>) => {
            state.paymentStatus = action.payload.status;
            state.paymentMessage = action.payload.message;
            state.wompiReference = action.payload.reference;
            state.lastUpdated = Date.now();
        },

        // UI state
        setProcessing: (state, action: PayloadAction<boolean>) => {
            state.isProcessing = action.payload;
            if (action.payload) {
                state.error = null;
            }
        },

        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.isProcessing = false;
        },

        clearError: (state) => {
            state.error = null;
        },

        // Recovery
        restoreCheckout: (state, action: PayloadAction<CheckoutState>) => {
            Object.assign(state, action.payload);
        }
    }
});

export const {
    goToStep,
    nextStep,
    previousStep,
    resetCheckout,
    setProductData,
    setCardData,
    setCustomerData,
    setDeliveryData,
    setTransactionId,
    setPaymentResult,
    setProcessing,
    setError,
    clearError,
    restoreCheckout
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
