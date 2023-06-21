import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  filteredProducts: [],
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    FILTER_BY_SEARCH(state, action) {
      const { products, search } = action.payload;
      // sau khi truyền products và search vào t dùng filter để lọc
      //lọc lấy tên sản phẩm với điều kiện là chữ đầu không viết hoa .includes(search) nghĩa là điều kiện lọc này chỉ thực thi khi viết ở trong search
      const tempProducts = products.filter(
        (product) =>
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.category.toLowerCase().includes(search.toLowerCase()),
      );

      state.filteredProducts = tempProducts;
    },
    // product vs sort vs search nhận từ productList
    SORT_PRODUCTS(state, action) {
      const { products, sort } = action.payload;
      let tempProducts = [];
      //điều kiện này sẽ về products mặc định chưa lọc
      if (sort === 'latest') {
        tempProducts = products;
      }
      // sort nhận vào 2 tham số a là từ thấp đến cao, b là từ cao đến thấp
      /**
       * Ở đoạn mã trên, hàm slice() được sử dụng để tạo ra một bản sao của mảng products. Điều này được thực hiện để tránh thay đổi trực tiếp mảng gốc products.
       *  Nếu không sử dụng hàm slice(), thì khi sắp xếp lại các sản phẩm, mảng products gốc sẽ bị thay đổi, dẫn đến khó khăn trong việc xử lý các yêu cầu khác với dữ liệu ban đầu.
        Vì vậy, việc sử dụng slice() giúp đảm bảo rằng mảng gốc không bị thay đổi, và các thao tác trên mảng được thực hiện trên bản sao của nó.
       */
      // slice() vốn dĩ dùng để cắt, những slice() ko truyền tham số cắt vào thì nó được dùng để lữu bản sao của dữ liệu
      // nếu ko có slice() thì nó sẽ thay đổi chính bản gốc của mình và ko phục hồi lại khi xóa đi hoặc reset
      if (sort === 'lowest-price') {
        tempProducts = products.slice().sort((a, b) => {
          return a.price - b.price;
        });
      }
      if (sort === 'highest-price') {
        tempProducts = products.slice().sort((a, b) => {
          return b.price - a.price;
        });
      }
      // lọc ký tự từ a-z vd: abcdefgh....
      if (sort === 'a-z') {
        tempProducts = products.slice().sort((a, b) => {
          return a.name.localeCompare(b.name);
        });
      }
      if (sort === 'z-a') {
        tempProducts = products.slice().sort((a, b) => {
          return b.name.localeCompare(a.name);
        });
      }

      state.filteredProducts = tempProducts;
    },

    FILTER_BY_CATEGORY(state, action) {
      console.log(action.payload);
      const { products, category } = action.payload;
      let tempProducts = [];
      if (category === 'All') {
        tempProducts = products;
      } else {
        tempProducts = products.filter((product) => product.category === category);
      }
      state.filteredProducts = tempProducts;
    },

    FILTER_BY_BRAND(state, action) {
      console.log(action.payload);
      const { products, brand } = action.payload;
      let tempProducts = [];
      if (brand === 'All') {
        tempProducts = products;
      } else {
        tempProducts = products.filter((product) => product.brand === brand);
      }
      state.filteredProducts = tempProducts;
    },
    FILTER_BY_PRICE(state, action) {
      const { products, price } = action.payload;
      let tempProducts = [];
      // lọc ra sp nhỏ hơn hoặc = price mà price ở đây là giá cao nhất mình đã setPrice mỗi lần ng dùng thay đổi giá thì nó sẽ update giá khác vừa đưa vào price
      tempProducts = products.filter((product) => product.price <= price);

      state.filteredProducts = tempProducts;
    },
  },
});
export const { FILTER_BY_SEARCH, SORT_PRODUCTS, FILTER_BY_CATEGORY, FILTER_BY_BRAND, FILTER_BY_PRICE } =
  filterSlice.actions;

export const selectFilteredProducts = (state) => state.filter.filteredProducts;

export default filterSlice.reducer;
