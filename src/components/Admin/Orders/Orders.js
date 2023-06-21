import classNames from 'classnames/bind';

import styles from './Orders.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectUserID } from '~/redux/slice/authSlice';
import { STORE_ORDERS, selectOrderHistory } from '~/redux/slice/orderSlice';
import useFetchCollection from '~/customHook/useFetchCollection';
import { useEffect } from 'react';
import Loader from '~/components/Loader/Loader';

const cx = classNames.bind(styles);

function Orders() {
  const { data, isLoading } = useFetchCollection('orders');

  const orders = useSelector(selectOrderHistory);
  const userID = useSelector(selectUserID);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(STORE_ORDERS(data));
  }, [dispatch, data]);

  const handleClick = (id) => {
    navigate(`/admin/order-details/${id}`);
  };

  return (
    <div>
      <h2>All Orders</h2>
      <p>
        Open an order to <b>Change order status</b>
      </p>
      <br />
      <>
        {isLoading && <Loader />}
        <div className={cx('table')}>
          {orders.length === 0 ? (
            <p>No order found</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>s/n</th>
                  <th>Date</th>
                  <th>Order ID</th>
                  <th>Order Amount</th>
                  <th>Order Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => {
                  const { id, orderDate, orderTime, orderAmount, orderStatus } = order;
                  return (
                    <tr key={id} onClick={() => handleClick(id)}>
                      <td>{index + 1}</td>
                      <td>
                        {orderDate} at {orderTime}
                      </td>
                      <td>{id}</td>
                      <td>
                        {'$'}
                        {orderAmount}
                      </td>
                      <td>
                        {/* nếu dữ liệu trong thằng orderStatus ko phải là Delivered thì sẽ sự dụng css pending, 
                    checkoutForm dữ liệu thằng orderStatus mình để mặc định là Order Placed... nên sẽ khác với Delivered và ăn vào css pending */}
                        <p className={orderStatus !== cx('Delivered') ? cx('pending') : cx('delivered')}>
                          {orderStatus}
                        </p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </>
    </div>
  );
}

export default Orders;
