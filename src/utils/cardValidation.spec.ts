import {
    detectCardType,
    validateCardNumber,
    validateExpiryDate,
    validateCVC,
    validateCardHolder,
    formatCardNumber,
    formatExpiryDate,
    getLastFourDigits,
    maskCardNumber,
} from './cardValidation';

describe('Card Validation Utilities', () => {
    describe('detectCardType', () => {
        it('should detect VISA cards', () => {
            expect(detectCardType('4111111111111111')).toBe('VISA');
            expect(detectCardType('4242424242424242')).toBe('VISA');
            expect(detectCardType('4000 0000 0000 0000')).toBe('VISA');
        });

        it('should detect MasterCard cards (51-55)', () => {
            expect(detectCardType('5111111111111111')).toBe('MASTERCARD');
            expect(detectCardType('5555555555554444')).toBe('MASTERCARD');
            expect(detectCardType('5200000000000000')).toBe('MASTERCARD');
        });

        it('should detect MasterCard cards (2221-2720)', () => {
            expect(detectCardType('2221000000000000')).toBe('MASTERCARD');
            expect(detectCardType('2720000000000000')).toBe('MASTERCARD');
        });

        it('should return null for unknown card types', () => {
            expect(detectCardType('3530111333300000')).toBeNull();
            expect(detectCardType('6011111111111117')).toBeNull();
            expect(detectCardType('1234567890123456')).toBeNull();
        });

        it('should handle cards with spaces', () => {
            expect(detectCardType('4111 1111 1111 1111')).toBe('VISA');
            expect(detectCardType('5555 5555 5555 4444')).toBe('MASTERCARD');
        });
    });

    describe('validateCardNumber - Luhn Algorithm', () => {
        it('should validate correct VISA cards', () => {
            expect(validateCardNumber('4111111111111111')).toBe(true);
            expect(validateCardNumber('4242424242424242')).toBe(true);
        });

        it('should validate correct MasterCard cards', () => {
            expect(validateCardNumber('5555555555554444')).toBe(true);
            expect(validateCardNumber('5105105105105100')).toBe(true);
        });

        it('should reject invalid card numbers', () => {
            expect(validateCardNumber('4111111111111112')).toBe(false);
            expect(validateCardNumber('1234567890123456')).toBe(false);
        });

        it('should reject cards with invalid length', () => {
            expect(validateCardNumber('411111111111')).toBe(false);
            expect(validateCardNumber('41111111111111111111')).toBe(false);
        });

        it('should handle cards with spaces', () => {
            expect(validateCardNumber('4111 1111 1111 1111')).toBe(true);
            expect(validateCardNumber('5555 5555 5555 4444')).toBe(true);
        });

        it('should reject non-numeric input', () => {
            expect(validateCardNumber('abcd efgh ijkl mnop')).toBe(false);
            expect(validateCardNumber('4111-1111-1111-1111')).toBe(false);
        });
    });

    describe('formatCardNumber', () => {
        it('should format card number with spaces', () => {
            expect(formatCardNumber('4111111111111111')).toBe('4111 1111 1111 1111');
            expect(formatCardNumber('5555555555554444')).toBe('5555 5555 5555 4444');
        });

        it('should handle partial card numbers', () => {
            expect(formatCardNumber('4111')).toBe('4111');
            expect(formatCardNumber('41111111')).toBe('4111 1111');
        });

        it('should remove existing spaces before formatting', () => {
            expect(formatCardNumber('4111 1111 1111 1111')).toBe('4111 1111 1111 1111');
        });
    });

    describe('validateExpiryDate', () => {
        it('should validate future dates', () => {
            const futureYear = (new Date().getFullYear() % 100) + 1;
            expect(validateExpiryDate(`12/${futureYear}`)).toBe(true);
        });

        it('should reject past dates', () => {
            expect(validateExpiryDate('12/20')).toBe(false);
            expect(validateExpiryDate('01/21')).toBe(false);
        });

        it('should validate current month/year', () => {
            const now = new Date();
            const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
            const currentYear = String(now.getFullYear() % 100).padStart(2, '0');

            expect(validateExpiryDate(`${currentMonth}/${currentYear}`)).toBe(true);
        });

        it('should reject invalid months', () => {
            const futureYear = (new Date().getFullYear() % 100) + 1;
            expect(validateExpiryDate(`00/${futureYear}`)).toBe(false);
            expect(validateExpiryDate(`13/${futureYear}`)).toBe(false);
        });

        it('should reject invalid format', () => {
            expect(validateExpiryDate('1225')).toBe(false);
            expect(validateExpiryDate('12-25')).toBe(false);
            expect(validateExpiryDate('12/2025')).toBe(false);
        });
    });

    describe('formatExpiryDate', () => {
        it('should format expiry date as MM/YY', () => {
            expect(formatExpiryDate('1225')).toBe('12/25');
            expect(formatExpiryDate('0126')).toBe('01/26');
        });

        it('should handle partial input', () => {
            expect(formatExpiryDate('1')).toBe('1');
            expect(formatExpiryDate('12')).toBe('12/');
        });

        it('should remove non-numeric characters', () => {
            expect(formatExpiryDate('12/25')).toBe('12/25');
            expect(formatExpiryDate('12-25')).toBe('12/25');
        });
    });

    describe('validateCVC', () => {
        it('should validate 3-digit CVC', () => {
            expect(validateCVC('123')).toBe(true);
            expect(validateCVC('999')).toBe(true);
        });

        it('should validate 4-digit CVC (Amex)', () => {
            expect(validateCVC('1234')).toBe(true);
            expect(validateCVC('9999')).toBe(true);
        });

        it('should reject invalid CVC', () => {
            expect(validateCVC('12')).toBe(false);
            expect(validateCVC('12345')).toBe(false);
            expect(validateCVC('abc')).toBe(false);
            expect(validateCVC('')).toBe(false);
        });
    });

    describe('validateCardHolder', () => {
        it('should validate valid names', () => {
            expect(validateCardHolder('John Doe')).toBe(true);
            expect(validateCardHolder('MARIA GARCIA')).toBe(true);
            expect(validateCardHolder('Jean Pierre')).toBe(true);
        });

        it('should reject names that are too short', () => {
            expect(validateCardHolder('Jo')).toBe(false);
            expect(validateCardHolder('A')).toBe(false);
        });

        it('should reject names with numbers', () => {
            expect(validateCardHolder('John123')).toBe(false);
            expect(validateCardHolder('123 Doe')).toBe(false);
        });

        it('should reject names with special characters', () => {
            expect(validateCardHolder('John@Doe')).toBe(false);
            expect(validateCardHolder('John-Doe')).toBe(false);
        });

        it('should trim whitespace', () => {
            expect(validateCardHolder('  John Doe  ')).toBe(true);
        });
    });

    describe('getLastFourDigits', () => {
        it('should extract last 4 digits', () => {
            expect(getLastFourDigits('4111111111111111')).toBe('1111');
            expect(getLastFourDigits('5555555555554444')).toBe('4444');
        });

        it('should handle cards with spaces', () => {
            expect(getLastFourDigits('4111 1111 1111 1111')).toBe('1111');
            expect(getLastFourDigits('5555 5555 5555 4444')).toBe('4444');
        });
    });

    describe('maskCardNumber', () => {
        it('should mask card number showing only last 4 digits', () => {
            expect(maskCardNumber('4111111111111111')).toBe('**** **** **** 1111');
            expect(maskCardNumber('5555555555554444')).toBe('**** **** **** 4444');
        });

        it('should handle cards with spaces', () => {
            expect(maskCardNumber('4111 1111 1111 1111')).toBe('**** **** **** 1111');
        });
    });
});
