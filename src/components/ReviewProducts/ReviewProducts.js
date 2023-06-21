import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';

import { useSelector } from 'react-redux';
import { selectProducts } from '~/redux/slice/productSlice';
import { selectUserID, selectUserName } from '~/redux/slice/authSlice';
import styles from './ReviewProducts.module.scss';
import { useParams } from 'react-router-dom';
import Card from '../Card/Card';
import StarsRating from 'react-star-rate';
import { db } from '~/firebase/config';
import { Timestamp, addDoc, collection } from 'firebase/firestore';
import { toast } from 'react-toastify';
import useFetchDocument from '~/customHook/useFetchDocument';
import spinnerImg from '~/assets/images/spinner.jpg';

const cx = classNames.bind(styles);

function ReviewProducts() {
  const [rate, setRate] = useState(0);
  const [review, setReview] = useState('');
  const [product, setProduct] = useState(null);
  // id useParrams sẽ hiểu và lấy ra id hiện tại của trang
  const { id } = useParams();
  const products = useSelector(selectProducts);
  const userID = useSelector(selectUserID);
  const userName = useSelector(selectUserName);

  // lấy product theo id hiện tại từ useParams lấy trang
  const { document } = useFetchDocument('products cua admin trung hieu', id);

  // lọc ra id sản phẩm bằng id của trang
  useEffect(() => {
    setProduct(document);
  }, [document]);
  // lưu lại dữ liệu người comment
  const submitReview = (e) => {
    e.preventDefault();

    const today = new Date();
    const date = today.toDateString();
    const reviewConfig = {
      userID,
      userName,
      productID: id,
      rate,
      review,
      reviewDate: date,
      createAt: Timestamp.now().toDate(),
    };

    try {
      addDoc(collection(db, 'reviews'), reviewConfig);
      toast.success('Review submitted successfully');
      setRate(0);
      setReview('');
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div className={cx('grid', 'wide')}>
      <div className={cx('review')}>
        <h2>Review Product</h2>
        {product === null ? (
          <img src={spinnerImg} alt="...Loading" />
        ) : (
          <>
            <p>
              <b>Product name:</b> {product.name}
            </p>
            <img src={product.imageURL} alt={product.name} style={{ width: '100px' }} />
          </>
        )}
        <Card cardClass={cx('card')}>
          <form onSubmit={(e) => submitReview(e)}>
            <label>Rating:</label>
            <StarsRating
              value={rate}
              onChange={(rate) => {
                setRate(rate);
              }}
            />
            <label>Review</label>
            <textarea
              value={review}
              required
              onChange={(e) => setReview(e.target.value)}
              cols="30"
              rows="10"
            ></textarea>
            <button type="submit" className={cx('--btn', '--btn-primary')}>
              Submit review
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default ReviewProducts;
