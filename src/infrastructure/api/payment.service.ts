import { Result } from '../../domain/logic/result';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface CreateCustomerDto {
    name: string;
    email: string;
    phone: string;
}

export interface CreateCustomerResponse {
    customerId: string;
    email: string;
}

export interface CreateTransactionItemDto {
    productId: string;
    quantity: number;
}

export interface CreateTransactionDto {
    items: CreateTransactionItemDto[];
    customerId: string;
}

export interface CreateTransactionResponse {
    transactionId: string;
    totalAmount: number;
    baseFee: number;
    deliveryFee: number;
    status: string;
}

export interface ProcessPaymentDto {
    cardToken: string;
    acceptanceToken: string;
    customerEmail: string;
    deliveryAddress: string;
    deliveryCity: string;
    deliveryPostalCode?: string;
}

export interface ProcessPaymentResponse {
    status: 'APPROVED' | 'DECLINED' | 'ERROR' | 'PENDING';
    transactionId: string;
    message?: string;
    wompiReference?: string;
}

export interface WompiAcceptanceTokenResponse {
    acceptanceToken: string;
    permalink: string;
}

export const paymentService = {
    async createCustomer(data: CreateCustomerDto): Promise<Result<CreateCustomerResponse>> {
        try {
            const response = await fetch(`${API_URL}/customers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const error = await response.json();
                return Result.fail(error.message || 'Failed to create customer');
            }

            const customer = await response.json();
            return Result.ok(customer);
        } catch (error) {
            return Result.fail(error instanceof Error ? error.message : 'Network error');
        }
    },

    async createTransaction(data: CreateTransactionDto): Promise<Result<CreateTransactionResponse>> {
        try {
            const response = await fetch(`${API_URL}/transactions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const error = await response.json();
                return Result.fail(error.message || 'Failed to create transaction');
            }

            const transaction = await response.json();
            return Result.ok(transaction);
        } catch (error) {
            return Result.fail(error instanceof Error ? error.message : 'Network error');
        }
    },

    async processPayment(
        transactionId: string,
        data: ProcessPaymentDto
    ): Promise<Result<ProcessPaymentResponse>> {
        try {
            const response = await fetch(`${API_URL}/transactions/${transactionId}/process`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const error = await response.json();
                return Result.fail(error.message || 'Failed to process payment');
            }

            const result = await response.json();
            return Result.ok(result);
        } catch (error) {
            return Result.fail(error instanceof Error ? error.message : 'Network error');
        }
    },

    async getAcceptanceToken(): Promise<Result<WompiAcceptanceTokenResponse>> {
        try {
            const response = await fetch(`${API_URL}/transactions/wompi/acceptance-token`);

            if (!response.ok) {
                const error = await response.json();
                return Result.fail(error.message || 'Failed to get acceptance token');
            }

            const data = await response.json();
            return Result.ok(data);
        } catch (error) {
            return Result.fail(error instanceof Error ? error.message : 'Network error');
        }
    },

    async getTransactionStatus(transactionId: string): Promise<Result<ProcessPaymentResponse>> {
        try {
            const response = await fetch(`${API_URL}/transactions/${transactionId}/status`);

            if (!response.ok) {
                const error = await response.json();
                return Result.fail(error.message || 'Failed to get transaction status');
            }

            const data = await response.json();
            return Result.ok(data);
        } catch (error) {
            return Result.fail(error instanceof Error ? error.message : 'Network error');
        }
    }
};
