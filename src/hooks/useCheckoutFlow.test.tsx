import { renderHook, act } from '@testing-library/react';
import { useCheckoutFlow } from './useCheckoutFlow';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import checkoutReducer from '../store/slices/checkout.slice';
import { paymentService } from '../infrastructure/api/payment.service';
import { wompiService } from '../infrastructure/api/wompi.service';
import { Result } from '../domain/logic/result';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../infrastructure/api/payment.service');
vi.mock('../infrastructure/api/wompi.service');

const mockCustomer = { customerId: 'cust_123', email: 'test@test.com' };
const mockTransaction = {
    transactionId: 'tx_123',
    totalAmount: 15000,
    baseFee: 5000,
    deliveryFee: 10000,
    status: 'PENDING'
};
const mockAcceptance = { acceptanceToken: 'token_abc', permalink: 'http://...' };
const mockPaymentSuccess = { status: 'APPROVED', transactionId: 'tx_123', wompiReference: 'ref_123' };

const createWrapper = () => {
    const store = configureStore({
        reducer: { checkout: checkoutReducer },
        preloadedState: {
            checkout: {
                currentStep: 3,
                productId: 'prod_1',
                productAmount: 5000,
                customerName: 'Test User',
                customerEmail: 'test@test.com',
                customerPhone: '3001234567',
                cardToken: 'tok_card_123',
                deliveryAddress: 'Calle 123',
                deliveryCity: 'Bogota',
                deliveryPostalCode: '111111'
            } as any
        }
    });
    return ({ children }: { children: React.ReactNode }) => <Provider store={store}>{children}</Provider>;
};

describe('useCheckoutFlow (ROP Pattern)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should successfully process the entire payment flow (Happy Path)', async () => {
       
        vi.mocked(paymentService.createCustomer).mockResolvedValue(Result.ok(mockCustomer));
        vi.mocked(paymentService.createTransaction).mockResolvedValue(Result.ok(mockTransaction));
        vi.mocked(paymentService.getAcceptanceToken).mockResolvedValue(Result.ok(mockAcceptance));
        vi.mocked(paymentService.processPayment).mockResolvedValue(Result.ok({ ...mockPaymentSuccess, status: 'APPROVED' } as any));

        const wrapper = createWrapper();
        const { result } = renderHook(() => useCheckoutFlow(), { wrapper });

       
        await act(async () => {
            await result.current.processPayment();
        });

       
        expect(paymentService.createCustomer).toHaveBeenCalled();
        expect(paymentService.createTransaction).toHaveBeenCalled();
        expect(paymentService.getAcceptanceToken).toHaveBeenCalled();
        expect(paymentService.processPayment).toHaveBeenCalled();

       
        expect(result.current.checkout.currentStep).toBe(4);
        expect(result.current.checkout.paymentStatus).toBe('APPROVED');
    });

    it('should stop flow if Consumer Creation fails (Railway Break)', async () => {
       
        vi.mocked(paymentService.createCustomer).mockResolvedValue(Result.fail('Invalid Email'));

        const wrapper = createWrapper();
        const { result } = renderHook(() => useCheckoutFlow(), { wrapper });

       
        await act(async () => {
            await result.current.processPayment();
        });

       
        expect(paymentService.createCustomer).toHaveBeenCalled();
        expect(paymentService.createTransaction).not.toHaveBeenCalled();

       
        expect(result.current.checkout.paymentStatus).toBe('ERROR');
        expect(result.current.checkout.paymentMessage).toBe('Invalid Email');
    });

    it('should handle Declined Payment correctly', async () => {
       
        vi.mocked(paymentService.createCustomer).mockResolvedValue(Result.ok(mockCustomer));
        vi.mocked(paymentService.createTransaction).mockResolvedValue(Result.ok(mockTransaction));
        vi.mocked(paymentService.getAcceptanceToken).mockResolvedValue(Result.ok(mockAcceptance));

       
        vi.mocked(paymentService.processPayment).mockResolvedValue(Result.fail('Transaction Declined: Insufficient Funds'));

        const wrapper = createWrapper();
        const { result } = renderHook(() => useCheckoutFlow(), { wrapper });

       
        await act(async () => {
            await result.current.processPayment();
        });

       
        expect(result.current.checkout.paymentStatus).toBe('DECLINED');
        expect(result.current.checkout.paymentMessage).toContain('Transaction Declined');
    });
});
