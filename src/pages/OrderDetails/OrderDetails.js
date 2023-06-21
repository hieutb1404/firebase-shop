import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { Link, useParams } from 'react-router-dom';
import useFetchDocument from '~/customHook/useFetchDocument';
import spinnerImg from '~/assets/images/spinner.jpg';

import styles from './OrderDetails.module.scss';

const cx = classNames.bind(styles);

function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const { document } = useFetchDocument('orders', id);

  useEffect(() => {
    setOrder(document);
  }, [document]);

  return (
    <div className={cx('grid', 'wide')}>
      <div className={cx('table')}>
        <h2>Order Details</h2>
        <div className={cx('')}>
          <Link to="/order-history">&larr; Back To Orders</Link>
        </div>
        <br />
        {order === null ? (
          <img src={spinnerImg} alt="...Loading" style={{ width: '50px' }} />
        ) : (
          <>
            <p>
              <b>Order ID</b> {order.id}
            </p>
            <p>
              <b>Order Amount</b> ${order.orderAmount}
            </p>
            <p>
              <b>Order Status</b> {order.orderStatus}
            </p>
            <br />
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
                {/* cartItems ở đây đã được lưu trên toolbar trình duyệt web nên order.cartItem hoàn toàn đc */}
                {order.cartItems.map((cart, index) => {
                  const { id, name, price, imageURL, cartQuantity } = cart;
                  return (
                    <tr key={id}>
                      <td>
                        <b>{index + 1}</b>
                      </td>
                      <td>
                        <p>
                          <b>{name}</b>
                        </p>
                        <img src={imageURL} alt={name} style={{ width: '100px' }} />
                      </td>
                      <td>{price}</td>
                      <td>{cartQuantity}</td>
                      <td>{(price * cartQuantity).toFixed(2)}</td>
                      <td className={cx('icons')}>
                        <Link to={`/review-product/${id}`}>
                          <button className={cx('--btn', '--btn-primary')}>Review Product</button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}

export default OrderDetails;
