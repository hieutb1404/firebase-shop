import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useFetchCollection from '~/customHook/useFetchCollection';
import { GET_PRICE_RANGE, selectProducts, STORE_PRODUCTS } from '~/redux/slice/productSlice';

import styles from './Product.module.scss';
import ProductFilter from './ProductFilter/ProductFilter';
import ProductList from './ProductList/ProductList';
import spinnerImg from '~/assets/images/spinner.jpg';
import { FaCogs } from 'react-icons/fa';

const cx = classNames.bind(styles);

function Product() {
  // nhận tham số là tên product trên firebase mà mình đã đặt ở add product
  const { data, isLoading } = useFetchCollection('products cua admin trung hieu');
  const [showFilter, setShowFilter] = useState(false);

  // sau khi dispatch xong nó lại lấy lại dữ liệu trong STORE_PRODUCTS và đổ vào biến mới là const products = useSelector(selectProducts);
  const products = useSelector(selectProducts);
  const dispatch = useDispatch();

  //getProducts là lấy dữ liệu từ trên firebase đc gọi là dữ liệu ngoài
  // thằng useState sau khi cập nhật và lấy dữ đưa vào chỗ cần hiện dữ liệu đó, thì muốn nó hiện ra ngoài, render ra ngoài ta phải dùng useEffect()
  // giống như useEffect có nhiệm vụ là truy vấn thằng useState, sau khi t dùng set của useEffect nó sẽ chưa render ra vội, mà phải chờ thằng useEffect đưa nó ra
  // useState ... setData cũng như là kiểu chỉ là cập nhật dữ liệu riêng biệt đó.. còn render ra ngoài thì phải cần useEffect
  // và nó sẽ cập nhật liên tục khi có dữ liệu mới chứ k phải thằng setData trong useState
  // tóm lại useEffect là bố của useState... useState muốn làm gì phải hỏi bố và có bố

  // sau khi effect đổ dữ liệu cập nhật vào data (thì data sẽ có dữ liệu)
  // sang bên này muốn đổ dữ liệu vào story thì dispatch vào đc vào trong useEffect thì nó sẽ cập nhật đưa dữ liệu vào STRORE_PRODUCTS
  // sau khi dispatch xong nó lại lấy lại dữ liệu trong STORE_PRODUCTS và đổ vào biến mới là const products = useSelector(selectProducts);
  useEffect(() => {
    dispatch(
      STORE_PRODUCTS({
        products: data,
      }),
    );
    dispatch(GET_PRICE_RANGE({ products: data }));
  }, [dispatch, data]);

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };
  return (
    <div className={cx('grid', 'wide')}>
      <div className={cx('container', 'product')}>
        <aside className={showFilter ? cx('filter', 'show') : cx('filter')}>
          {isLoading ? null : <ProductFilter />}
        </aside>

        <div className={cx('content')}>
          {/* nhận 1 props là products vào tên products tự đặt */}
          {isLoading ? (
            <img src={spinnerImg} alt="Loading..." style={{ width: '50px' }} className={cx('--center-all')} />
          ) : (
            <ProductList products={products} />
          )}
          <div className={cx('icon')} onClick={toggleFilter}>
            <FaCogs size={20} color="orangered" />
            <p>
              <b>{showFilter ? 'Hide Filter' : 'Show Filter'}</b>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;
