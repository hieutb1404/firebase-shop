import classNames from 'classnames/bind';

import styles from './Card.module.scss';

const cx = classNames.bind(styles);

function Card({ children, cardClass }) {
  return <div className={cx('card', cardClass)}>{children}</div>;
}

export default Card;
