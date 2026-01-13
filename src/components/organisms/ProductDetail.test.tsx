import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ProductDetail } from './ProductDetail';
import type { Product } from '../../domain/models/Product';

const mockProduct: Product = {
    id: '1',
    name: 'Premium T-Shirt',
    description: 'High quality cotton t-shirt',
    price: 25000,
    availableStock: 10,
    sku: 'TSH-001',
    brand: 'Premium Basics',
    specifications: {
        material: '100% Cotton',
        sizes: ['S', 'M', 'L', 'XL'],
        color: 'White',
        care: 'Machine wash',
    },
    imageUrl: 'test.jpg',
    images: ['test1.jpg', 'test2.jpg'],
    category: {
        id: '1',
        name: 'Clothing',
        slug: 'clothing',
        description: 'Apparel items',
    },
    averageRating: 4.5,
    reviewCount: 10,
    isActive: true,
};

describe('ProductDetail', () => {
    const renderWithRouter = (product: Product) => {
        return render(
            <BrowserRouter>
                <ProductDetail product={product} />
            </BrowserRouter>
        );
    };

    it('renders product name', () => {
        renderWithRouter(mockProduct);
        expect(screen.getByText('Premium T-Shirt')).toBeInTheDocument();
    });

    it('renders product price formatted', () => {
        renderWithRouter(mockProduct);
        expect(screen.getByText(/25\.000/)).toBeInTheDocument();
    });

    it('shows available stock when stock > 5', () => {
        renderWithRouter(mockProduct);
        expect(screen.getByText(/Disponible • 10 unidades/)).toBeInTheDocument();
    });

    it('shows low stock warning when stock <= 5', () => {
        const lowStockProduct = { ...mockProduct, availableStock: 3 };
        renderWithRouter(lowStockProduct);
        expect(screen.getByText(/Últimas 3 unidades/)).toBeInTheDocument();
    });

    it('renders specifications dynamically', () => {
        renderWithRouter(mockProduct);
        expect(screen.getByText('Material')).toBeInTheDocument();
        expect(screen.getByText('100% Cotton')).toBeInTheDocument();
        expect(screen.getByText('Color')).toBeInTheDocument();
        expect(screen.getByText('White')).toBeInTheDocument();
    });

    it('renders array specifications as comma-separated', () => {
        renderWithRouter(mockProduct);
        expect(screen.getByText('S, M, L, XL')).toBeInTheDocument();
    });

    it('capitalizes specification keys', () => {
        renderWithRouter(mockProduct);
        expect(screen.getByText('Material')).toBeInTheDocument();
        expect(screen.getByText('Sizes')).toBeInTheDocument();
    });

    it('renders product description', () => {
        renderWithRouter(mockProduct);
        expect(screen.getByText('High quality cotton t-shirt')).toBeInTheDocument();
    });

    it('renders average rating', () => {
        renderWithRouter(mockProduct);
        expect(screen.getByText(/4\.5/)).toBeInTheDocument();
    });

    it('renders review count', () => {
        renderWithRouter(mockProduct);
        expect(screen.getByText(/10 reviews/)).toBeInTheDocument();
    });

    it('handles product without specifications', () => {
        const productWithoutSpecs = { ...mockProduct, specifications: {} };
        renderWithRouter(productWithoutSpecs);
        expect(screen.getByText('Características del producto')).toBeInTheDocument();
    });
});
