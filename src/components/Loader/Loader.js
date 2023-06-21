import classNames from 'classnames/bind';

import styles from './Loader.module.scss';
import loaderImg from '~/assets/images/loader.gif';
import ReactDOM from 'react-dom';

const cx = classNames.bind(styles);
// sử dụng ReactDom.createPortal thì mới có thể gọi document.getElement từ index.html
function Loader() {
  return ReactDOM.createPortal(
    <div className={cx('wrapper')}>
      <div className={cx('loader')}>
        <img src={loaderImg} alt="loading..." />
      </div>
    </div>,
    // loader là id từ file index.html
    document.getElementById('loader'),
  );
}

export default Loader;
