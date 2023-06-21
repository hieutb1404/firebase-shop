import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';

import styles from './Header.module.scss';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import config from '~/config';
import { FaShoppingCart, FaTimes, FaUserCircle } from 'react-icons/fa';
import { HiOutlineMenuAlt3 } from 'react-icons/hi';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '~/firebase/config';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { SET_ACTIVE_USER, REMOVE_ACTIVE_USER } from '~/redux/slice/authSlice';
import ShowOnLogin, { ShowOnLogut } from '../HiddenLink/HiddenLink';
import AdminOnlyRoute from '~/components/AdminOnlyRoute/AdminOnlyRoute';
import { CALCULATE_TOTAL_QUANTITY, selectCartTotalQuantity } from '~/redux/slice/cartSlice';

const cx = classNames.bind(styles);

const logo = (
  <div className={cx('logo')}>
    <Link to="/">
      <h2>
        h<span>Shop</span>.
      </h2>
    </Link>
  </div>
);

const navLinks = [
  {
    path: config.routers.home,
    display: 'Home',
  },
  {
    path: config.routers.contact,
    display: 'Contact Us',
  },
];

const activeLink = ({ isActive }) => (isActive ? cx('active') : '');

function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [scrollPage, setScrollPage] = useState('');

  const navigate = useNavigate();

  const cartTotalQuantity = useSelector(selectCartTotalQuantity);

  useEffect(() => {
    dispatch(CALCULATE_TOTAL_QUANTITY());
  }, []);

  const dispatch = useDispatch();

  const fixNavbar = () => {
    if (window.scrollY > 50) {
      setScrollPage(true);
    } else {
      setScrollPage(false);
    }
  };
  window.addEventListener('scroll', fixNavbar);

  // Monitor currently sign in user
  // nhận dữ liệu user từ ngoài nên phải dùng useEffect
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      // tham số 1: auth để xác minh có user đó ko
      // tham số 2: nhận giá trị user trên firesebase
      if (user) {
        // truyền dữ liệu vào thằng cập nhật từ thằng user

        // lấy ra tên người dùng = email
        if (user.displayName == null) {
          // cắt tên email từ tên đến dấu @ là ngừng
          // nó sẽ tìm nếu phía trước nó có dấu @ thì nó sẽ dừng lại luôn và bỏ @
          // vd hieu@gmail.com thì chỉ lấy hieu
          const u1 = user.email.substring(0, user.email.indexOf('@'));
          console.log(u1);
          // vd : tên Hiếu , chartAt(0) nó sẽ lấy ký tự h và bỏ đằng sau là iếu
          // khi lấy đc h.toUpperCase để viết hoa chữ H lên
          // sau đó lại dùng dữ liệu u1 là chữ hieu cắt bỏ chữ h đi tính từ số 1(là chữ h)
          // sau khi slice xong bây giờ nó còn lại là iêu + nối chuỗi charAt lại thành Hiếu
          // slice là cắt thằng nào vứt thằng đó chứ k lấy
          const uName = u1.charAt(0).toUpperCase() + u1.slice(1);
          setDisplayName(uName);
        } else {
          // trường hợp này là dữ liệu firebase
          setDisplayName(user.displayName);
        }
        /**
         * Dispatcher sẽ làm trung gian của action và function handler(hàm xử lý)
          Dispatcher sẽ kiếm tra action có khớp thông tin đang có không
          Nếu có khớp thì sẽ chạy function handler

         */
        // user.email,displayname,uid ở đây là thuộc tính bên trong của user trên firebase
        dispatch(
          SET_ACTIVE_USER({
            email: user.email,
            //user.displayName nếu có user chấm thì ko phải của useState mà là của firebase
            // còn ko có user. thì là của useState
            // trường hơp này nếu có tên trên firebase thì lấy trên đó , còn ko thì lấy của useState cắt tên từ email ra
            userName: user.displayName ? user.displayName : displayName,
            userID: user.uid,
          }),
        );
      } else {
        setDisplayName('');
        dispatch(REMOVE_ACTIVE_USER());
      }
    });
    // sẽ render lại mỗi khi dispatch và display thay đổi
    // vd như đăng nhập nhiều tài khoản, có nhiêu tên...
  }, [dispatch, displayName]);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const hideMenu = () => {
    setShowMenu(false);
  };

  const logoutUser = () => {
    signOut(auth)
      .then(() => {
        toast.success('Đã đăng xuất!');
        navigate('/');
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const cart = (
    <span className={cx('cart')}>
      <Link to={config.routers.cart}>
        Cart
        <FaShoppingCart size={20} />
        <p>{cartTotalQuantity}</p>
      </Link>
    </span>
  );

  return (
    <header className={scrollPage ? cx('fixed') : null}>
      <div className={cx('grid', 'wide')}>
        <div className={cx('header')}>
          {logo}
          <nav className={cx(showMenu ? 'show-nav' : 'hide-nav')}>
            <div
              onClick={hideMenu}
              className={showMenu ? cx('nav-wrapper', 'show-nav-wrapper') : cx('nav-wrapper')}
            ></div>
            <ul>
              <li className={cx('logo-mobile')}>
                {logo}
                <FaTimes size={22} color="#fff" onClick={hideMenu} />
              </li>

              <li>
                <AdminOnlyRoute>
                  <Link to="/admin/home">
                    <button className={cx('--btn --btn-primary')}>Admin</button>
                  </Link>
                </AdminOnlyRoute>
              </li>

              {navLinks.map((item, index) => (
                <li key={index}>
                  <NavLink className={activeLink} onClick={hideMenu} to={item.path}>
                    {item.display}
                  </NavLink>
                </li>
              ))}
            </ul>
            <div onClick={hideMenu} className={cx('header-right')}>
              <span className={cx('links')}>
                <ShowOnLogut>
                  <NavLink className={activeLink} to="/login">
                    Login
                  </NavLink>
                </ShowOnLogut>

                <ShowOnLogin>
                  <a href="#home">
                    <FaUserCircle />
                    {/* vì thằng displayName này ăn theo thằng set
                    nên sẽ có dữ liệu từ thằng setDisplayName */}
                    Hi, {displayName}
                  </a>
                </ShowOnLogin>

                <ShowOnLogut>
                  <NavLink className={activeLink} to="/register">
                    Register
                  </NavLink>
                </ShowOnLogut>
                <ShowOnLogin>
                  <NavLink className={activeLink} to="/order-history">
                    My Orders
                  </NavLink>
                </ShowOnLogin>
                {/* nếu = true thì render logout ra màn hình */}
                <ShowOnLogin>
                  <NavLink to="/" onClick={logoutUser}>
                    Logout
                  </NavLink>
                </ShowOnLogin>
              </span>

              {cart}
            </div>
          </nav>
          {/* mobile tablet */}
          <div className={cx('menu-icon')}>
            {cart}
            <HiOutlineMenuAlt3 size={28} onClick={toggleMenu} />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
