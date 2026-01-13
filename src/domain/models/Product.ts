import type { Category } from './Category';

export interface ProductSpecifications {
    material?: string;
    sizes?: string[];
    color?: string;
    care?: string;
    [key: string]: any;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    availableStock: number;
    sku: string;
    brand: string;
    specifications: ProductSpecifications;
    imageUrl: string;
    images: string[];
    category: Category | null;
    averageRating: number;
    reviewCount: number;
    isActive: boolean;
    slug: string;
}
