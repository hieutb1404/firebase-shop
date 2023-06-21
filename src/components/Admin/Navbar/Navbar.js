import classNames from 'classnames/bind';
import { FaUserCircle } from 'react-icons/fa';
import styles from './Navbar.module.scss';
import { useSelector } from 'react-redux';
import { selectUserName } from '~/redux/slice/authSlice';
import { NavLink } from 'react-router-dom';

const cx = classNames.bind(styles);

const activeLink = ({ isActive }) => (isActive ? cx('active') : '');

function Navbar() {
  const useName = useSelector(selectUserName);

  return (
    <div className={cx('navbar')}>
      <div className={cx('user')}>
        <FaUserCircle size={40} color="#fff" />
        <h4>Admin: {useName}</h4>
      </div>

      <nav>
        <ul>
          <li>
            <NavLink to="/admin/home" className={activeLink}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/all-products" className={activeLink}>
              All-Products
            </NavLink>
          </li>
          <li>
            {/* đuôi ADD sẽ giả lập cho /:id bên Admin. Nếu có id thì ẩn ADD, */}
            <NavLink to="/admin/add-product/ADD" className={activeLink}>
              Add Product
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/orders" className={activeLink}>
              Orders
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
