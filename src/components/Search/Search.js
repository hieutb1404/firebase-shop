import classNames from 'classnames/bind';

import styles from './Search.module.scss';
import { BiSearch } from 'react-icons/bi';

const cx = classNames.bind(styles);

function Search({ value, onChange }) {
  return (
    <div className={cx('search')}>
      <BiSearch size={18} className={cx('icon')} />

      <input type="text" placeholder="Search by name" value={value} onChange={onChange} />
    </div>
  );
}

export default Search;
