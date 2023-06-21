import classNames from 'classnames/bind';

import styles from './Footer.module.scss';

const cx = classNames.bind(styles);

const date = new Date();
const year = date.getFullYear();

function Footer() {
  return <div className={cx('footer')}>&copy; {year} All Rights Reserved</div>;
}

export default Footer;
