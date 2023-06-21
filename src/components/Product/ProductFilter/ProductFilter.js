import classNames from 'classnames/bind';

import styles from './ProductFilter.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { selectMaxPrice, selectMinPrice, selectProducts } from '~/redux/slice/productSlice';
import { useEffect, useState } from 'react';
import {
  FILTER_BY_BRAND,
  FILTER_BY_CATEGORY,
  FILTER_BY_PRICE,
  selectFilteredProducts,
} from '~/redux/slice/filterSlice';

const cx = classNames.bind(styles);

function ProductFilter() {
  const [category, setCategory] = useState('All');
  const [brand, setBrand] = useState('All');
  const [price, setPrice] = useState(1000);
  const products = useSelector(selectProducts);
  // sau khi lấy đc giá cao vs thấp của sp ta import vào đây
  // để đưa vào input xử lý trên useState price, setPrice
  const minPrice = useSelector(selectMinPrice);
  const maxPrice = useSelector(selectMaxPrice);

  const dispatch = useDispatch();

  //new Set(...) tạo ra một Set mới từ mảng kết quả của các category. Set là một tập hợp các giá trị duy nhất, do đó bất kỳ giá trị trùng lặp nào trong mảng đều bị loại bỏ.
  //...new Set để lấy ra chi tiết giá trị đó
  const allCategories = ['All', ...new Set(products.map((product) => product.category))];
  const allBrand = ['All', ...new Set(products.map((product) => product.brand))];

  // console.log(allCategories);

  /// vì products được lấy từ selectproducts mà selectProducts đã được sử dụng useEffect rồi nên ta ko cần sử dụng useeffect nữa
  // vào viewProduct để xem là products trong selectProducts đã đc sử dụng useEffect nên vào đây t k cần dùng

  function filterProducts(categ) {
    setCategory(categ);

    dispatch(FILTER_BY_CATEGORY({ products, category: categ }));
  }

  useEffect(() => {
    dispatch(FILTER_BY_BRAND({ products, brand }));
  }, [dispatch, products, brand]);
  // sau khi t lấy giá sp từ input t dispatch vào để xử lý hàm lọc giá sản phẩm
  useEffect(() => {
    dispatch(
      FILTER_BY_PRICE({
        products,
        price,
      }),
    );
  }, [dispatch, products, price]);

  // khi bấm clear trạng thái về ban đầu
  const clearFilters = () => {
    setCategory('All');
    setBrand('All');
    setPrice(maxPrice);
  };
  return (
    <div className={cx('filter')}>
      <h4>Category</h4>

      <div className={cx('category')}>
        {allCategories.map((categ, index) => {
          return (
            <button
              key={index}
              type="button"
              className={category === categ ? cx('active') : null}
              onClick={() => filterProducts(categ)}
            >
              &#8250; {categ}
            </button>
          );
        })}
      </div>

      <h4>Brand</h4>
      <div className={cx('brand')}>
        <select name="brand" value={brand} onChange={(e) => setBrand(e.target.value)}>
          {allBrand.map((brand, index) => {
            return (
              // ví sử dụng value nên t ko cần lắng nghe onclick
              <option key={index} value={brand}>
                {brand}
              </option>
            );
          })}
        </select>

        <h4>Price</h4>
        <p>{`$${price}`}</p>
        <div className={cx('price')}>
          <input
            type="range"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            name="proce"
            min={minPrice}
            max={maxPrice}
          />
        </div>
        <br />
        <button className={cx('--btn --btn-danger')} onClick={clearFilters}>
          Clear Filter
        </button>
      </div>
    </div>
  );
}

export default ProductFilter;
