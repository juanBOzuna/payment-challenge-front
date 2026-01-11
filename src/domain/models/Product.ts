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
    stock: number;
    sku: string;
    brand: string;
    specifications: ProductSpecifications;
    imageUrl: string;
    images: string[];
    category: Category | null;
    averageRating: number;
    reviewCount: number;
    isActive: boolean;
}
