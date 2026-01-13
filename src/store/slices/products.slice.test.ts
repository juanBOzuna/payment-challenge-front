import { describe, it, expect, vi, beforeEach } from 'vitest';
import productsReducer, { fetchProducts } from './products.slice';
import { ProductService } from '../../infrastructure/api/product.service';
import type { Product } from '../../domain/models/Product';

vi.mock('../../infrastructure/api/product.service');

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

describe('productsSlice', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return initial state', () => {
        const state = productsReducer(undefined, { type: 'unknown' });
        expect(state.items).toEqual([]);
        expect(state.status).toBe('idle');
        expect(state.error).toBeNull();
        expect(state.meta).toBeDefined();
        expect(state.filters).toBeDefined();
    });

    describe('fetchProducts', () => {
        it('should handle pending state', () => {
            const action = { type: fetchProducts.pending.type };
            const state = productsReducer(undefined, action);
            expect(state.status).toBe('loading');
        });

        it('should handle fulfilled state', () => {
            const products = [mockProduct];
            const payload = { data: products, meta: { total: 1, page: 1, limit: 10, totalPages: 1 } };
            const action = { type: fetchProducts.fulfilled.type, payload };
            const state = productsReducer(undefined, action);

            expect(state.status).toBe('succeeded');
            expect(state.items).toEqual(products);
            expect(state.meta).toEqual(payload.meta);
        });

        it('should handle rejected state', () => {
            const action = {
                type: fetchProducts.rejected.type,
                error: { message: 'Failed to fetch' }
            };
            const state = productsReducer(undefined, action);
            expect(state.status).toBe('failed');
            expect(state.error).toBe('Failed to fetch');
        });

        it('should use default error message when none provided', () => {
            const action = { type: fetchProducts.rejected.type, error: {} };
            const state = productsReducer(undefined, action);
            expect(state.error).toBe('Something went wrong');
        });
    });

    describe('fetchProducts thunk', () => {
        it('should fetch products successfully', async () => {
            const products = [mockProduct];
            vi.mocked(ProductService.getAll).mockResolvedValue({ data: products, meta: {} });

            const dispatch = vi.fn();
            const thunk = fetchProducts();

            const mockState = {
                products: {
                    filters: {
                        page: 1, limit: 10, search: '', categoryId: ''
                    }
                }
            };
            await thunk(dispatch, () => mockState, undefined);

            expect(ProductService.getAll).toHaveBeenCalledTimes(1);
        });

        it('should handle fetch error', async () => {
            vi.mocked(ProductService.getAll).mockRejectedValue(new Error('Network error'));

            const dispatch = vi.fn();
            const thunk = fetchProducts();

            const mockState = {
                products: {
                    filters: {
                        page: 1, limit: 10, search: '', categoryId: ''
                    }
                }
            };
            await thunk(dispatch, () => mockState, undefined);

            expect(ProductService.getAll).toHaveBeenCalledTimes(1);
        });
    });
});
