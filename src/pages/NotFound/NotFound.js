import classNames from 'classnames/bind';

import styles from './NotFound.module.scss';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function NotFound() {
  return (
    <div className={cx('not-found')}>
      <div>
        <h2>404</h2>
        <p>Oppppppsss, page not found</p>
        <button className={cx('--btn')}>
          <Link to="/">&larr; Back To Home</Link>
        </button>
      </div>
    </div>
  );
}

export default NotFound;
