import classNames from 'classnames/bind';
import useFetchCollection from '~/customHook/useFetchCollection';
import styles from './OrderHistory.module.scss';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { STORE_ORDERS, selectOrderHistory } from '~/redux/slice/orderSlice';
import { selectUserID } from '~/redux/slice/authSlice';
import Loader from '~/components/Loader/Loader';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function OrderHistory() {
  const { data, isLoading } = useFetchCollection('orders');

  const orders = useSelector(selectOrderHistory);
  const userID = useSelector(selectUserID);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(STORE_ORDERS(data));
  }, [dispatch, data]);

  const handleClick = (id) => {
    navigate(`/order-details/${id}`);
  };
  // lọc order sản phẩm theo id khách hàng
  const filteredOrders = orders.filter((order) => order.userID === userID);

  return (
    <div className={cx('grid', 'wide')}>
      <h2>Your Order History</h2>
      <p>
        Open an order to leave a <b>Product Review</b>
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
                {filteredOrders.map((order, index) => {
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

export default OrderHistory;
