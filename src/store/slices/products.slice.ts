import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../../domain/models/Product';
import { ProductService } from '../../infrastructure/api/product.service';

interface CatalogState {
    items: Product[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
    filters: {
        page: number;
        limit: number;
        search: string;
        categoryId: string;
    };
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: CatalogState = {
    items: [],
    meta: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
    },
    filters: {
        page: 1,
        limit: 10,
        search: '',
        categoryId: '',
    },
    status: 'idle',
    error: null,
};

export const fetchProducts = createAsyncThunk('catalog/fetchProducts', async (_, { getState }) => {
    const state = getState() as any;
    const filters = state.products.filters;
    return await ProductService.getAll(filters);
});

export const catalogSlice = createSlice({
    name: 'catalog',
    initialState,
    reducers: {
        setPage: (state, action: PayloadAction<number>) => {
            state.filters.page = action.payload;
        },
        setSearch: (state, action: PayloadAction<string>) => {
            state.filters.search = action.payload;
            state.filters.page = 1; // Reset to first page on new search
        },
        setCategory: (state, action: PayloadAction<string>) => {
            state.filters.categoryId = action.payload;
            state.filters.page = 1;
        },
        resetFilters: (state) => {
            state.filters = initialState.filters;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<{ data: Product[]; meta: any }>) => {
                state.status = 'succeeded';
                state.items = action.payload.data;
                state.meta = action.payload.meta;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Something went wrong';
            });
    },
});

export const { setPage, setSearch, setCategory, resetFilters } = catalogSlice.actions;
export default catalogSlice.reducer;
