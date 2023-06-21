import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

import styles from './CheckoutDetails.module.scss';

const cx = classNames.bind(styles);

function CheckoutSuccess() {
  return (
    <div className={cx('grid', 'wide')}>
      <h2>Checkout Successful</h2>
      <p>Thank you for purchase</p>
      <br />
      <button className={cx('--btn', '--btn-primary')}>
        <Link to="/order-history">View Order Status</Link>
      </button>
      <br />
    </div>
  );
}

export default CheckoutSuccess;
