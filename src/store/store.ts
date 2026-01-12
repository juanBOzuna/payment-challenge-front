import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import productsReducer from './slices/products.slice';
import checkoutReducer from './slices/checkout.slice';
import uiReducer from './slices/ui.slice';
import cartReducer from './slices/cart.slice';

const rootReducer = combineReducers({
    products: productsReducer,
    checkout: checkoutReducer,
    ui: uiReducer,
    cart: cartReducer,
});

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['checkout', 'cart'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
