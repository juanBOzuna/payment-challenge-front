import type { Product } from '../../domain/models/Product';

const API_URL = 'http://localhost:3000';

export const ProductService = {
    getAll: async (params?: { page?: number; limit?: number; search?: string; categoryId?: string }): Promise<{ data: Product[]; meta: any }> => {
        const query = new URLSearchParams();
        if (params?.page) query.append('page', params.page.toString());
        if (params?.limit) query.append('limit', params.limit.toString());
        if (params?.search) query.append('search', params.search);
        if (params?.categoryId) query.append('categorySlug', params.categoryId);

        const response = await fetch(`${API_URL}/products?${query.toString()}`);
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        return response.json();
    },
};
