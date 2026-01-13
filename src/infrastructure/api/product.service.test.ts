import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ProductService } from './product.service';
import type { Product } from '../../domain/models/Product';

const mockProduct: Product = {
    id: '1',
    name: 'Test Product',
    description: 'Test description',
    price: 100,
    availableStock: 10,
    sku: 'TEST-001',
    brand: 'Test Brand',
    specifications: { material: 'Cotton' },
    imageUrl: 'test.jpg',
    images: ['test.jpg'],
    category: { id: '1', name: 'Test', slug: 'test', description: 'Test category' },
    averageRating: 4.5,
    reviewCount: 10,
    isActive: true,
};

describe('ProductService', () => {
    beforeEach(() => {
        global.fetch = vi.fn();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('getAll', () => {
        it('fetches products successfully', async () => {
            const mockProducts = [mockProduct];
            vi.mocked(global.fetch).mockResolvedValueOnce({
                ok: true,
                json: async () => mockProducts,
            } as Response);

            const result = await ProductService.getAll();

            expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/products');
            expect(result).toEqual(mockProducts);
        });

        it('throws error when response is not ok', async () => {
            vi.mocked(global.fetch).mockResolvedValueOnce({
                ok: false,
                status: 500,
            } as Response);

            await expect(ProductService.getAll()).rejects.toThrow('Failed to fetch products');
        });

        it('handles network errors', async () => {
            vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Network error'));

            await expect(ProductService.getAll()).rejects.toThrow('Network error');
        });

        it('calls correct API endpoint', async () => {
            vi.mocked(global.fetch).mockResolvedValueOnce({
                ok: true,
                json: async () => [],
            } as Response);

            await ProductService.getAll();

            expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/products');
            expect(global.fetch).toHaveBeenCalledTimes(1);
        });
    });
});
