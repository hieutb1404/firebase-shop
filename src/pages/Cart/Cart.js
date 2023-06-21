import classNames from 'classnames/bind';

import styles from './Cart.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import {
  ADD_TO_CART,
  CALCULATE_SUBTOTAL,
  CALCULATE_TOTAL_QUANTITY,
  CLEAR_CART,
  DECREASE_CART,
  REMOVE_FROM_CART,
  SAVE_URL,
  selectCartItems,
  selectCartTotalAmount,
  selectCartTotalQuantity,
} from '~/redux/slice/cartSlice';
import { selectIsLoggedIn } from '~/redux/slice/authSlice';
import { Link } from 'react-router-dom';
import { FaTrashAlt } from 'react-icons/fa';
import Card from '~/components/Card/Card';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function Cart() {
  const cartItems = useSelector(selectCartItems);
  const cartTotalAmount = useSelector(selectCartTotalAmount);
  const cartTotalQuantity = useSelector(selectCartTotalQuantity);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const increaseCart = (cart) => {
    dispatch(ADD_TO_CART(cart));
  };
  const decreaseCart = (cart) => {
    dispatch(DECREASE_CART(cart));
  };

  const removeFromCart = (cart) => {
    dispatch(REMOVE_FROM_CART(cart));
  };
  const clearCart = () => {
    dispatch(CLEAR_CART());
  };

  // phải render ra ngoài thì cartTotalAmount và cartTotalQuantity mới hiện số liệu giá trị đã được logic
  // vì 2 thằng dispatch này xử lý logic của tổng tiền và tổng số lượng nên phải useEffect 2 thằng này
  useEffect(() => {
    dispatch(CALCULATE_SUBTOTAL());
    dispatch(CALCULATE_TOTAL_QUANTITY());
    dispatch(SAVE_URL(''));
  }, [dispatch, cartItems]);

  const url = window.location.href;

  // nêu đăng nhập thì mới cho thanh toán không tih ngược lại
  const checkout = () => {
    if (isLoggedIn) {
      navigate('/checkout-details');
    } else {
      dispatch(SAVE_URL(url));
      navigate('/login');
    }
  };
  return (
    <div className={cx('grid', 'wide')}>
      <div className={cx('table')}>
        <h2>Shopping Cart</h2>
        {cartItems.length === 0 ? (
          <>
            <p>Không có sản phẩm trong giỏ hàng.</p>
            <div>
              <Link to="/#products">&larr; Tiếp tục mua hàng</Link>
            </div>
          </>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>s/n</th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((cart, index) => {
                  const { id, name, price, imageURL, cartQuantity } = cart;
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <p>{name}</p>
                        <img src={imageURL} alt={name} style={{ width: '100px' }} />
                      </td>
                      <td>{price}</td>
                      <td>
                        <div className={cx('count')}>
                          <button className={cx('--btn')} onClick={() => decreaseCart(cart)}>
                            -
                          </button>
                          <p>
                            <b>{cartQuantity}</b>
                          </p>
                          <button className={cx('--btn')} onClick={() => increaseCart(cart)}>
                            +
                          </button>
                        </div>
                      </td>
                      <td>{price * cartQuantity.toFixed(2)}</td>
                      <td className={cx('icons')}>
                        <FaTrashAlt size={19} color="red" onClick={() => removeFromCart(cart)} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className={cx('summary')}>
              <button className="--btn --btn-danger" onClick={() => clearCart()}>
                Clear Cart
              </button>
              <div className={cx('checkout')}>
                <Link to="/#products">&larr; Tiếp tục mua hàng</Link>
                <br />
                <Card cardClass={cx('card')}>
                  <p>
                    <b>{`Cart item(s): ${cartTotalQuantity}`}</b>
                  </p>
                  <div className={cx('text')}>
                    <h4>Subtotal:</h4>
                    <h3>{`$${cartTotalAmount.toFixed(2)}`}</h3>
                  </div>
                  <p>Tax an shipping calculated at checkout</p>
                  <button className="--btn --btn-primary --btn-block" onClick={checkout}>
                    Checkout
                  </button>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;
