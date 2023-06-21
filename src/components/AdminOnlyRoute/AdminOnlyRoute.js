import { useSelector } from 'react-redux';
import { selectEmail } from '~/redux/slice/authSlice';
import { Link } from 'react-router-dom';

function AdminOnlyRoute({ children }) {
  // useSelector là gì? Hook này cho phép chúng ta lấy state từ Redux store bằng cách sử dụng một selector function làm tham số đầu vào.
  const userEmail = useSelector(selectEmail);
  // nó sẽ so sánh nếu đúng = email admin thì nó sẽ trả return children (trong children có <Admin/> và <h1>login</h1>)
  if (userEmail === 'toilahieu2244@gmail.com') {
    return children;
  }
  return null;
}

export function AdminOnlyLink({ children }) {
  const userEmail = useSelector(selectEmail);

  if (userEmail === 'toilahieu2244@gmail.com') {
    return children;
  }
  return (
    <div className="grid wide" style={{ height: '80vh' }}>
      <div className="container">
        <h2>Không được phép truy cập</h2>
        <p>Trang này chỉ dành cho Admin</p>
        <br />
        <Link to="/">
          <button className="--btn ">&larr; Quay lại trang chủ</button>
        </Link>
      </div>
    </div>
  );
}

export default AdminOnlyRoute;
