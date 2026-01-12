import { useState } from 'react';
import { useCheckoutFlow } from '../../../hooks/useCheckoutFlow';
import { CardNumberInput } from '../../molecules/CardNumberInput';
import { formatExpiryDate } from '../../../utils/cardValidation';
import type { CardType } from '../../../utils/cardValidation';
import './CardDeliveryStep.css';

export const CardDeliveryStep = () => {
    const { submitCardAndDelivery, checkout } = useCheckoutFlow();

    // Card data
    const [cardNumber, setCardNumber] = useState('');
    const [cardType, setCardType] = useState<CardType>(null);
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [cardHolder, setCardHolder] = useState('');

    // Customer data
    const [name, setName] = useState(checkout.customerName || '');
    const [email, setEmail] = useState(checkout.customerEmail || '');
    const [phone, setPhone] = useState(checkout.customerPhone || '');

    // Delivery data
    const [address, setAddress] = useState(checkout.deliveryAddress || '');
    const [city, setCity] = useState(checkout.deliveryCity || '');
    const [postalCode, setPostalCode] = useState(checkout.deliveryPostalCode || '');

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatExpiryDate(e.target.value);
        setExpiry(formatted);
    };

    const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        if (value.length <= 4) {
            setCvc(value);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting || checkout.isProcessing) return;

        setIsSubmitting(true);
        const [expiryMonth, expiryYear] = expiry.split('/');

        await submitCardAndDelivery({
            cardNumber,
            cvc,
            expiryMonth,
            expiryYear,
            cardHolder,
            name,
            email,
            phone,
            address,
            city,
            postalCode,
        });
        setIsSubmitting(false);
    };

    const isFormValid =
        cardNumber.replace(/\s/g, '').length >= 13 &&
        expiry.length === 5 &&
        cvc.length >= 3 &&
        cardHolder.length >= 3 &&
        name.length >= 3 &&
        email.includes('@') &&
        phone.length >= 10 &&
        address.length >= 10 &&
        city.length >= 3;

    return (
        <form onSubmit={handleSubmit} className="card-delivery-step">
            {/* Card Information */}
            <section className="card-delivery-step__section">
                <h3 className="card-delivery-step__title">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                        <line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                    Información de Tarjeta
                </h3>

                <CardNumberInput
                    value={cardNumber}
                    onChange={setCardNumber}
                    onCardTypeDetected={setCardType}
                />

                <div className="card-delivery-step__field">
                    <label htmlFor="cardHolder">Titular de la Tarjeta</label>
                    <input
                        id="cardHolder"
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                        placeholder="Nombre en la tarjeta"
                        autoComplete="cc-name"
                        required
                    />
                </div>

                <div className="card-delivery-step__row">
                    <div className="card-delivery-step__field">
                        <label htmlFor="expiry">Fecha de Expiración</label>
                        <input
                            id="expiry"
                            type="text"
                            value={expiry}
                            onChange={handleExpiryChange}
                            placeholder="MM/YY"
                            maxLength={5}
                            autoComplete="cc-exp"
                            required
                        />
                    </div>

                    <div className="card-delivery-step__field">
                        <label htmlFor="cvc">CVC</label>
                        <input
                            id="cvc"
                            type="text"
                            inputMode="numeric"
                            value={cvc}
                            onChange={handleCvcChange}
                            placeholder="123"
                            maxLength={4}
                            autoComplete="cc-csc"
                            required
                        />
                    </div>
                </div>
            </section>

            {/* Customer Information */}
            <section className="card-delivery-step__section">
                <h3 className="card-delivery-step__title">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                    Información Personal
                </h3>

                <div className="card-delivery-step__field">
                    <label htmlFor="name">Nombre Completo</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Juan Pérez"
                        autoComplete="name"
                        required
                    />
                </div>

                <div className="card-delivery-step__field">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="juan@example.com"
                        autoComplete="email"
                        required
                    />
                </div>

                <div className="card-delivery-step__field">
                    <label htmlFor="phone">Teléfono</label>
                    <input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+57 300 123 4567"
                        autoComplete="tel"
                        required
                    />
                </div>
            </section>

            {/* Delivery Information */}
            <section className="card-delivery-step__section">
                <h3 className="card-delivery-step__title">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="1" y="3" width="15" height="13" />
                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                        <circle cx="5.5" cy="18.5" r="2.5" />
                        <circle cx="18.5" cy="18.5" r="2.5" />
                    </svg>
                    Información de Entrega
                </h3>

                <div className="card-delivery-step__field">
                    <label htmlFor="address">Dirección</label>
                    <input
                        id="address"
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Calle 123 #45-67"
                        autoComplete="street-address"
                        required
                    />
                </div>

                <div className="card-delivery-step__row">
                    <div className="card-delivery-step__field">
                        <label htmlFor="city">Ciudad</label>
                        <input
                            id="city"
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="Bogotá"
                            autoComplete="address-level2"
                            required
                        />
                    </div>

                    <div className="card-delivery-step__field">
                        <label htmlFor="postal-code">Código Postal</label>
                        <input
                            id="postal-code"
                            type="text"
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            placeholder="110111"
                            autoComplete="postal-code"
                        />
                    </div>
                </div>
            </section>

            {/* Error Message near Action Button */}
            {checkout.error && (
                <div className="card-delivery-step__error-message" role="alert">
                    ⚠️ {checkout.error}
                </div>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                className="card-delivery-step__submit"
                disabled={!isFormValid || checkout.isProcessing || isSubmitting}
            >
                {checkout.isProcessing || isSubmitting ? 'Procesando...' : 'Continuar al Resumen →'}
            </button>
        </form>
    );
};
