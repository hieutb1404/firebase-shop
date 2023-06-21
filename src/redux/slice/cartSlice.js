import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const initialState = {
  // sau khi setItem xong thì thằng này sẽ kiểm tra là setItem có chuỗi là cartItems tồn tại hay ko
  // nếu tồn tại thì nó sẽ lấy cái chuối tồn tại đó là 'cartItems' chuyển tất cả thông tin nó lưu đc từ JSON sang dạng javascript(dạng dữ liệu đúng để đẩy lên server)
  cartItems: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],
  cartTotalQuantity: 0,
  cartTotalAmount: 0,
  previousURL: '',
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    ADD_TO_CART(state, action) {
      console.log(action.payload);
      // sản phẩm đã có trong giỏ hàng lọc ra tăng lên 1
      const productIndex = state.cartItems.findIndex((item) => item.id === action.payload.id);

      if (productIndex >= 0) {
        // sản phẩm tồn tại trong giỏ hàng
        // thì tăng số lượng
        state.cartItems[productIndex].cartQuantity += 1;
        toast.info(`${action.payload.name} đã tăng sản phẩm thêm 1`, { position: 'top-left' });
      } else {
        // sản phẩm không tồn tại trong giỏ hàng
        // thì thêm sản phẩm vào giỏ hàng

        const tempProduct = { ...action.payload, cartQuantity: 1 };
        state.cartItems.push(tempProduct);
        toast.success(`${action.payload.name} đã được thêm vào giỏ hàng`, { position: 'top-left' });
      }
      // save to cart(dev tool Application)
      // thằng này dùng để lưu giỏ hàng và đẩy chuỗi 'cartItems' lên Application F12 và cho thằng getItem nhận nó rồi chuyển từ JSON sang dạng javascript
      // lưu ý phải có thằng setItem() thì mới có thằng getItem
      // setItem = đẩy lên,, getItem = nhận về(đổi JSON sang dạng javascript)
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    DECREASE_CART(state, action) {
      const productIndex = state.cartItems.findIndex((item) => item.id === action.payload.id);
      if (state.cartItems[productIndex].cartQuantity > 1) {
        state.cartItems[productIndex].cartQuantity -= 1;
        toast.info(`${action.payload.name} đã giảm số lượng sản phẩm`, { position: 'top-left' });
      } else if (state.cartItems[productIndex].cartQuantity === 1) {
        const newCartItems = state.cartItems.filter((item) => item.id !== action.payload.id);
        state.cartItems = newCartItems;
        toast.success(`${action.payload.name} sản phẩm đã được loại bỏ khỏi giỏ hàng`, { position: 'top-left' });
      }
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    REMOVE_FROM_CART(state, action) {
      const newCartItems = state.cartItems.filter((item) => item.id !== action.payload.id);
      state.cartItems = newCartItems;
      toast.success(`${action.payload.name} sản phẩm đã được loại bỏ khỏi giỏ hàng`, { position: 'top-left' });
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    CLEAR_CART(state, action) {
      state.cartItems = [];
      toast.info(`đã xóa tất cả sản phẩm trong giỏ hàng`, { position: 'top-left' });
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    CALCULATE_SUBTOTAL(state, action) {
      const array = [];
      // lấy dữ liệu hiện có trong cartItems và lặp lấy ra ngoài xử lý tổng tiền
      state.cartItems.map((item) => {
        const { price, cartQuantity } = item;
        const cartItemAmount = price * cartQuantity;
        return array.push(cartItemAmount);
      });
      const totalAmount = array.reduce((a, b) => {
        return a + b;
      }, 0);
      // tổng tiền tất cả số lượng giỏ hàng
      state.cartTotalAmount = totalAmount;
    },
    CALCULATE_TOTAL_QUANTITY(state, action) {
      const array = [];
      // lấy dữ liệu hiện có trong cartItems và lặp lấy ra ngoài xử lý tổng tiền
      state.cartItems.map((item) => {
        const { cartQuantity } = item;
        const quantity = cartQuantity;
        return array.push(quantity);
      });
      const totalQuantity = array.reduce((a, b) => {
        return a + b;
      }, 0);
      state.cartTotalQuantity = totalQuantity;
    },
    SAVE_URL(state, action) {
      state.previousURL = action.payload;
    },
  },
});

export const {
  ADD_TO_CART,
  DECREASE_CART,
  REMOVE_FROM_CART,
  CLEAR_CART,
  CALCULATE_TOTAL_QUANTITY,
  CALCULATE_SUBTOTAL,
  SAVE_URL,
} = cartSlice.actions;

export const selectCartItems = (state) => state.cart.cartItems;

export const selectCartTotalQuantity = (state) => state.cart.cartTotalQuantity;

export const selectCartTotalAmount = (state) => state.cart.cartTotalAmount;

export const selectPreviousURL = (state) => state.cart.previousURL;

export default cartSlice.reducer;
