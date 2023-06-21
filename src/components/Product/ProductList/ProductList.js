import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';

import { BsFillGridFill } from 'react-icons/bs';
import { FaListAlt } from 'react-icons/fa';
import Search from '~/components/Search/Search';
import ProductItem from '../ProductItem/ProductItem';
import styles from './ProductList.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { FILTER_BY_SEARCH, selectFilteredProducts, SORT_PRODUCTS } from '~/redux/slice/filterSlice';
import Pagination from '~/components/Pagination/Pagination';

const cx = classNames.bind(styles);

function ProductList({ products }) {
  const [grid, setGrid] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('latest');
  // fillteredProduct sẽ lấy ra toàn bộ sản phẩm hiện tại và sản phẩm sau khi được lọc
  const fillteredProduct = useSelector(selectFilteredProducts);

  //Pagination state

  const [currentPage, SetCurrentPage] = useState(1);
  // productPerPage là số lượng sản phẩm trên một trang
  const [productPerPage, setProductPerPage] = useState(3);
  // Get current products
  const indexOfLastProduct = currentPage * productPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productPerPage;
  // slice nhận 2 vị trí cắt, ví trí 1 cắt chính nó và những thằng bên trái nó
  // vị trí 2: giữ nguyên nó và cắt những thằng bên phải nó
  const currentProducts = fillteredProduct.slice(indexOfFirstProduct, indexOfLastProduct);
  // fillteredProduct sẽ lấy ra toàn bộ sản phẩm hiện tại và sản phẩm sau khi được lọc

  const dispatch = useDispatch();
  // nằm trong useEffect để có thể render update khi người dùng search liên tục và render ra màn hình
  // truyền dữ liệu người dùng search xong và chuyển vào dispatch thực thi nhiệm vụ lọc
  useEffect(() => {
    dispatch(
      FILTER_BY_SEARCH({
        products,
        search,
      }),
    );
  }, [dispatch, products, search]);
  useEffect(() => {
    dispatch(
      SORT_PRODUCTS({
        products,
        sort,
      }),
    );
  }, [dispatch, products, sort]);

  return (
    <div className={cx('product-list')} id="product">
      <div className={cx('top')}>
        <div className={cx('icons')}>
          <BsFillGridFill size={22} color="orangered" onClick={() => setGrid(true)} />

          <FaListAlt size={24} color="#0066d4" onClick={() => setGrid(false)} />

          <p>
            <b>{currentProducts.length}</b> Products Found.
          </p>
        </div>
        {/* Search icon */}
        <div>
          <Search value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        {/* sort Products */}
        <div className={cx('sort')}>
          <label>Sort by:</label>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="latest">Latest</option>
            <option value="lowest-price">lowest Price</option>
            <option value="highest-price">Hightest Price</option>
            <option value="a-z">A - Z</option>
            <option value="z-a">Z - A</option>
          </select>
        </div>
      </div>
      <div className={grid ? cx('grid') : cx('list')}>
        {products.length === 0 ? (
          <p>Không tìm thấy sản phẩm nào</p>
        ) : (
          <>
            {currentProducts.map((product) => {
              return (
                <div key={product.id}>
                  {/* nếu t truyền props mà ko có tên để truyền thì nó sẽ hiểu và lấy toàn bộ tên biến trong product làm props
                  vd: ...product thì nó sẽ lấy các props trong nó là id, price,name,desc,imageURL
                  */}
                  <ProductItem {...product} grid={grid} product={product} />
                </div>
              );
            })}
          </>
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        setCurrentPage={SetCurrentPage}
        // productPerPage là số lượng sản phẩm trên một trang
        productPerPage={productPerPage}
        totalProducts={fillteredProduct.length}
      />
    </div>
  );
}

export default ProductList;
