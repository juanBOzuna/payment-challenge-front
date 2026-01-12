import { useState, type ChangeEvent, type FocusEvent } from 'react';
import { detectCardType, validateCardNumber, formatCardNumber, type CardType } from '../../utils/cardValidation';
import './CardNumberInput.css';

interface CardNumberInputProps {
    value: string;
    onChange: (value: string) => void;
    onCardTypeDetected?: (type: CardType) => void;
    error?: string;
}

export const CardNumberInput = ({ value, onChange, onCardTypeDetected, error }: CardNumberInputProps) => {
    const [cardType, setCardType] = useState<CardType>(null);
    const [validationError, setValidationError] = useState<string>('');

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/\s/g, '');

        // Only allow digits and max 16 digits
        if (!/^\d*$/.test(rawValue) || rawValue.length > 16) {
            return;
        }

        const formatted = formatCardNumber(rawValue);
        onChange(formatted);

        // Detect card type
        const type = detectCardType(rawValue);
        setCardType(type);
        if (onCardTypeDetected) {
            onCardTypeDetected(type);
        }

        // Clear validation error on change
        if (validationError) {
            setValidationError('');
        }
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/\s/g, '');

        if (rawValue.length === 0) {
            return;
        }

        if (!validateCardNumber(rawValue)) {
            setValidationError('Número de tarjeta inválido');
        }
    };

    const displayError = error || validationError;

    return (
        <div className="card-number-input">
            <label htmlFor="card-number" className="card-number-input__label">
                Número de Tarjeta
            </label>
            <div className="card-number-input__wrapper">
                <input
                    id="card-number"
                    type="text"
                    className={`card-number-input__field ${displayError ? 'card-number-input__field--error' : ''}`}
                    value={value}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    autoComplete="cc-number"
                />
                {cardType && (
                    <div className="card-number-input__logo">
                        {cardType === 'VISA' && (
                            <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
                                <rect width="40" height="24" rx="4" fill="#1A1F71" />
                                <text x="20" y="16" fontSize="10" fill="white" textAnchor="middle" fontWeight="bold">VISA</text>
                            </svg>
                        )}
                        {cardType === 'MASTERCARD' && (
                            <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
                                <rect width="40" height="24" rx="4" fill="#EB001B" />
                                <circle cx="15" cy="12" r="6" fill="#FF5F00" />
                                <circle cx="25" cy="12" r="6" fill="#F79E1B" />
                            </svg>
                        )}
                    </div>
                )}
            </div>
            {displayError && (
                <span className="card-number-input__error">{displayError}</span>
            )}
        </div>
    );
};
