import { Result } from '../../domain/logic/result';

const WOMPI_PUBLIC_KEY = import.meta.env.VITE_WOMPI_PUBLIC_KEY;
const WOMPI_SANDBOX_URL = 'https://api-sandbox.co.uat.wompi.dev/v1';

export interface CardData {
    number: string;
    cvc: string;
    exp_month: string;
    exp_year: string;
    card_holder: string;
}

export interface CardTokenResponse {
    id: string;
    status: string;
    created_at: string;
}

/**
 * Wompi Service - Direct integration with Wompi API
 * Uses Railway Oriented Programming with Result<T>
 */
export const wompiService = {
    /**
     * Tokenize credit card with Wompi
     * This is called directly from frontend for PCI compliance
     */
    async tokenizeCard(cardData: CardData): Promise<Result<CardTokenResponse>> {
        try {
            // Validate card data before sending
            const validation = this.validateCardData(cardData);
            if (validation.isFailure) {
                return Result.fail(validation.error!);
            }

            const response = await fetch(`${WOMPI_SANDBOX_URL}/tokens/cards`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${WOMPI_PUBLIC_KEY}`
                },
                body: JSON.stringify(cardData)
            });

            const result = await response.json();

            if (!response.ok) {
                // Handle different Wompi error formats
                let errorMessage = 'Card tokenization failed';

                if (result.error) {
                    if (Array.isArray(result.error.messages)) {
                        errorMessage = result.error.messages.join(', ');
                    } else if (typeof result.error.messages === 'object' && result.error.messages !== null) {
                        // Handle object format: { "field": ["Error message"] }
                        // Map entries to "field: message" strings
                        errorMessage = Object.entries(result.error.messages)
                            .map(([field, msgs]) => {
                                const friendlyName = FIELD_NAMES[field] || field;
                                return `${friendlyName}: ${(msgs as string[]).join(' ')}`;
                            })
                            .join(', ');
                    } else if (typeof result.error.messages === 'string') {
                        errorMessage = result.error.messages;
                    } else if (result.error.reason) {
                        errorMessage = result.error.reason;
                    } else if (typeof result.error === 'string') {
                        errorMessage = result.error;
                    } else if (result.error.type) {
                        errorMessage = `${result.error.type}`;
                    }
                }

                return Result.fail(errorMessage);
            }

            // Wompi returns { data: { id, status, ... } }
            return Result.ok(result.data);
        } catch (error) {
            return Result.fail(error instanceof Error ? error.message : 'Network error');
        }
    },

    /**
     * Validate card data before tokenization
     */
    validateCardData(cardData: CardData): Result<void> {
        if (!cardData.number || cardData.number.length < 13) {
            return Result.fail('Invalid card number');
        }

        if (!cardData.cvc || !/^\d{3,4}$/.test(cardData.cvc)) {
            return Result.fail('Invalid CVC');
        }

        if (!cardData.exp_month || !cardData.exp_year) {
            return Result.fail('Invalid expiry date');
        }

        if (!cardData.card_holder || cardData.card_holder.trim().length < 5) {
            return Result.fail('El nombre del titular debe tener al menos 5 caracteres');
        }

        return Result.ok(undefined);
    }
};

const FIELD_NAMES: Record<string, string> = {
    card_holder: 'Nombre del Titular',
    number: 'Número de Tarjeta',
    cvc: 'CVC',
    exp_month: 'Mes de Expiración',
    exp_year: 'Año de Expiración'
};
