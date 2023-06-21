import classNames from 'classnames/bind';

import styles from './ChangeOrderStatus.module.scss';
import { useState } from 'react';
import Loader from '~/components/Loader/Loader';
import Card from '~/components/Card/Card';
import { Timestamp, doc, setDoc } from 'firebase/firestore';
import { db } from '~/firebase/config';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function ChangeOrderStatus({ order, id }) {
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState('');

  const navigate = useNavigate();

  const editOder = (e, id) => {
    e.preventDefault();
    setIsLoading(true);

    const orderConfig = {
      // lấy order từ prop để gán biến
      // và tất cả biến  gán này đều có trong firebase và phải tổn tại trước để gán
      userID: order.userID,
      userEmail: order.userEmail,
      orderDate: order.orderDate,
      orderTime: order.orderTime,
      orderAmount: order.orderAmount,
      orderStatus: status,
      cartItems: order.cartItems,
      shippingAddress: order.shippingAddress,
      createAt: order.createAt,
      editedAt: Timestamp.now().toDate(),
    };

    try {
      setDoc(doc(db, 'orders', id), orderConfig);
      setIsLoading(false);
      toast.success('Order status changes successfully');
      navigate('/admin/orders');
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <Card cardClass={cx('card')}>
        <h4>Update Status</h4>
        <form onSubmit={(e) => editOder(e, id)}>
          <span>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="" disabled>
                -- Choose one --
              </option>
              <option value="Order Placed...">Placed...</option>

              <option value="Processing...">Processing...</option>
              <option value="Shipping...">Shipping...</option>
              <option value="Delivered">Delivered</option>
            </select>
          </span>
          <span>
            <button type="submit" className={cx('--btn', '--btn-primary')}>
              Update Status
            </button>
          </span>
        </form>
      </Card>
    </>
  );
}

export default ChangeOrderStatus;
