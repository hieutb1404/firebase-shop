import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from '~/redux/slice/authSlice';

function ShowOnLogin({ children }) {
  const isLoggedIn = useSelector(selectIsLoggedIn);

  // nếu đúng true đăng nhập return ra children lấy từ logout ở ngoài
  // sai thì ra null, nghĩa là trống ko có gì
  if (isLoggedIn) {
    return children;
  }
  return null;
}

export function ShowOnLogut({ children }) {
  const isLoggedIn = useSelector(selectIsLoggedIn);

  // nếu đăng nhập mà đúng thì true thành false, nếu false thì thành true
  //đăng nhập đúng = true.. ngược lại trả về false
  // nghĩa là nếu đăng nhập đúng thì = false sẽ return về null là ko lấy chữ login
  // còn chưa đăng nhập thì sẽ là false trả về true , và true sẽ là return children và có dữ liệu là login
  if (!isLoggedIn) {
    return children;
  }
  return null;
}

export default ShowOnLogin;
