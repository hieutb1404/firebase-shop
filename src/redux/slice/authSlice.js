import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  // null là trống, là chưa có gì
  email: null,
  userName: null,
  userID: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    //action có 2 kiểu trong nó là type: mô tả action là kiểu gì và kiểu 2 là payload
    // payload là tham số chứa dữ liệu của thằng action được dispatch bên ngoài  và trả về 1 state mới truyền vào initalstate rồi gửi đến file Store
    //state là chứa đựng dữ liệu (là initialState)
    SET_ACTIVE_USER: (state, action) => {
      console.log(action.payload);
      // sau khi lấy đc dữ liệu bên ngoài ta truyền vào state.email
      // truyền dữ liệu vào các biến mới tạo trùng với các tên  dữ liệu lấy ở ngoài sao cho khớp nhau
      const { email, userName, userID } = action.payload;
      state.isLoggedIn = true;
      state.email = email;
      state.userName = userName;
      state.userID = userID;
    },
    REMOVE_ACTIVE_USER: (state, action) => {
      state.isLoggedIn = false;
      state.email = null;
      state.userName = null;
      state.userID = null;
    },
  },
});
// export SET_ACTIVE_USER để lấy dữ liệu ngoài đưa vào payload
export const { SET_ACTIVE_USER, REMOVE_ACTIVE_USER } = authSlice.actions;

export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectEmail = (state) => state.auth.email;
export const selectUserName = (state) => state.auth.userName;
export const selectUserID = (state) => state.auth.userID;

export default authSlice.reducer;
