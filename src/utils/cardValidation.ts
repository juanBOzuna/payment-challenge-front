
export type CardType = 'VISA' | 'MASTERCARD' | null;


export const detectCardType = (cardNumber: string): CardType => {
    const cleaned = cardNumber.replace(/\s/g, '');

    if (/^4/.test(cleaned)) {
        return 'VISA';
    }

    if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) {
        return 'MASTERCARD';
    }

    return null;
};


export const validateCardNumber = (cardNumber: string): boolean => {
    const cleaned = cardNumber.replace(/\s/g, '');

    if (!/^\d{13,19}$/.test(cleaned)) {
        return false;
    }

    let sum = 0;
    let isEven = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
        let digit = parseInt(cleaned[i]);

        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        isEven = !isEven;
    }

    return sum % 10 === 0;
};


export const formatCardNumber = (value: string): string => {
    const cleaned = value.replace(/\s/g, '');
    const groups = cleaned.match(/.{1,4}/g) || [];
    return groups.join(' ');
};


export const validateExpiryDate = (expiry: string): boolean => {
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        return false;
    }

    const [month, year] = expiry.split('/').map(s => parseInt(s));

    if (month < 1 || month > 12) {
        return false;
    }

    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;

    if (year < currentYear) {
        return false;
    }

    if (year === currentYear && month < currentMonth) {
        return false;
    }

    return true;
};


export const formatExpiryDate = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');

    if (cleaned.length >= 2) {
        return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }

    return cleaned;
};


export const validateCVC = (cvc: string): boolean => {
    return /^\d{3,4}$/.test(cvc);
};


export const validateCardHolder = (name: string): boolean => {
    return name.trim().length >= 3 && /^[a-zA-Z\s]+$/.test(name);
};


export const getLastFourDigits = (cardNumber: string): string => {
    const cleaned = cardNumber.replace(/\s/g, '');
    return cleaned.slice(-4);
};


export const maskCardNumber = (cardNumber: string): string => {
    const lastFour = getLastFourDigits(cardNumber);
    return `**** **** **** ${lastFour}`;
};
