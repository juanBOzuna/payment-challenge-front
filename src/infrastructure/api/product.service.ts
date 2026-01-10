import type { Product } from '../../domain/models/Product';

const API_URL = 'http://localhost:3000';

export const ProductService = {
    getAll: async (): Promise<Product[]> => {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        return response.json();
    },
};
