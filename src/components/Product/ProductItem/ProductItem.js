import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import Card from '~/components/Card';
import { useDispatch } from 'react-redux';

import styles from './ProductItem.module.scss';
import { ADD_TO_CART, CALCULATE_TOTAL_QUANTITY } from '~/redux/slice/cartSlice';

const cx = classNames.bind(styles);

function ProductItem({ product, grid, id, name, price, imageURL, desc }) {
  const dispatch = useDispatch();

  const shortenText = (text, n) => {
    // n là số ký tự
    if (text.length > n) {
      const shortenedText = text.substring(0, n).concat('...');
      return shortenedText;
    }
    // ngược lại thì return text ko cần rút gọn ....
    return text;
  };
  // product ở đây ko phải toàn bộ list sp. mà chỉ là 1 sản phẩm có thông tin đầy đủ
  const addToCart = (product) => {
    dispatch(ADD_TO_CART(product));
    dispatch(CALCULATE_TOTAL_QUANTITY());
  };
  return (
    <Card cardClass={grid ? cx('grid') : cx('list')}>
      <Link to={`/product-details/${id}`}>
        <div className={cx('img')}>
          <img src={imageURL} alt={name} />
        </div>
      </Link>

      <div className={cx('content')}>
        <div className={cx('details')}>
          <p>{`$${price}`}</p>
          {/* truyền đối số là name từ props  và số ký tự */}
          <h4>{shortenText(name, 15)}</h4>
        </div>
        {!grid && <p className={cx('desc')}>{shortenText(desc, 200)}</p>}
        <button className={cx('--btn', '--btn-danger')} onClick={() => addToCart(product)}>
          Add To Cart
        </button>
      </div>
    </Card>
  );
}

export default ProductItem;
