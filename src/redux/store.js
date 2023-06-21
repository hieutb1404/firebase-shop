import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from '~/redux/slice/authSlice';
import productSlice from '~/redux/slice/productSlice';
import filterReducer from '~/redux/slice/filterSlice';
import cartReducer from '~/redux/slice/cartSlice';
import CheckoutReducer from '~/redux/slice/checkoutSlice';
import orderReducer from '~/redux/slice/orderSlice';

//method combineReducers() của Redux để kết hợp tất cả các reducer lại thành một list các reducer, mỗi một reducer sẽ xử lí một state riêng nhỏ.

// truyền dữ liệu từ thằng authSilce vào tên ngắn hơn là auth

const rootReducer = combineReducers({
  auth: authReducer,
  product: productSlice,
  filter: filterReducer,
  cart: cartReducer,
  checkout: CheckoutReducer,
  orders: orderReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
