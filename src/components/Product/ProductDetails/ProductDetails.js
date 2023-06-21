import classNames from 'classnames/bind';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { db } from '~/firebase/config';
import spinnerImg from '~/assets/images/spinner.jpg';
import styles from './ProductDetails.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { ADD_TO_CART, CALCULATE_TOTAL_QUANTITY, DECREASE_CART, selectCartItems } from '~/redux/slice/cartSlice';
import useFetchDocument from '~/customHook/useFetchDocument';
import Card from '~/components/Card/Card';
import StarsRating from 'react-star-rate';
import useFetchCollection from '~/customHook/useFetchCollection';

const cx = classNames.bind(styles);

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const dispatch = useDispatch();
  // fectjDocument lấy dữ liệu theo ID
  const { document } = useFetchDocument('products cua admin trung hieu', id);

  // fetch collection ko cần lấy dữ liệu theo ID
  const { data } = useFetchCollection('reviews');
  //lấy ra review trong details products
  const filteredReviews = data.filter((review) => review.productID === id);

  const cartItems = useSelector(selectCartItems);

  // lọc ra id trong prduct id trong cartSlice = id hiện tại ở ngoại details
  const cart = cartItems.find((cart) => cart.id === id);

  // lọc ví trí index
  const isCartAdded = cartItems.findIndex((cart) => {
    return cart.id === id;
  });

  // const getProducts = async () => {
  //   // lấy dữ liệu trên server theo id hiện tại
  //   const docRef = doc(db, 'products cua admin trung hieu', id);
  //   const docSnap = await getDoc(docRef);
  //   if (docSnap.exists()) {
  //     const obj = {
  //       id: id,
  //       ...docSnap.data(),
  //     };
  //     setProduct(obj);
  //   } else {
  //     toast.error('không tìm thấy sản phẩm');
  //   }
  // };
  useEffect(() => {
    setProduct(document);
  }, [document]);

  const addToCart = () => {
    dispatch(ADD_TO_CART(product));
    dispatch(CALCULATE_TOTAL_QUANTITY());
  };

  const decreaseCart = () => {
    dispatch(DECREASE_CART(product));
    dispatch(CALCULATE_TOTAL_QUANTITY());
  };

  return (
    <div className={cx('grid', 'wide')}>
      <div className={cx('product')}>
        <h2>Product Details</h2>
        <div>
          <Link to="#products">&larr; Back to Product</Link>
        </div>
        {product === null ? (
          <img src={spinnerImg} alt="loading....." style={{ width: '50px' }} />
        ) : (
          <>
            <div className={cx('details')}>
              <div className={cx('img')}>
                <img src={product.imageURL} alt={product.name} />
              </div>
              <div className={cx('content')}>
                <h3>{product.name}</h3>
                <p className={cx('price')}>{`$${product.price}`}</p>
                <p>{product.desc}</p>
                <p>
                  <b>Code</b> {product.id}
                </p>
                <p>
                  <b>Brand</b> {product.brand}
                </p>
                <div className={cx('count')}>
                  {/* nếu khi add vào giỏ hàng sp <0 thì ko hiện tăng giảm và chỉ có nút thêm sản phẩm ngược lại nếu có sp thì đc tăng giảm */}
                  {isCartAdded < 0 ? null : (
                    <>
                      <button className={cx('--btn')} onClick={() => decreaseCart(product)}>
                        -
                      </button>
                      <p>
                        <b>{cart.cartQuantity}</b>
                      </p>
                      <button className={cx('--btn')} onClick={() => addToCart()}>
                        +
                      </button>
                    </>
                  )}
                </div>
                <button className={cx('--btn --btn-danger')} onClick={() => addToCart()}>
                  ADD TO CART
                </button>
              </div>
            </div>
          </>
        )}
        <Card cardClass={cx('card')}>
          <h3>Product Reviews</h3>
          <div>
            {filteredReviews.length === 0 ? (
              <p>There are no reviews forr thí product yet.</p>
            ) : (
              <>
                {filteredReviews.map((item, index) => {
                  const { rate, review, reviewDate, useName } = item;
                  return (
                    <div className={cx('review')}>
                      <StarsRating value={rate} />
                      <p>{review}</p>
                      <span>
                        <b>{reviewDate}</b>
                      </span>
                      <br />
                      <span>
                        <b>by: {useName}</b>
                      </span>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default ProductDetails;
