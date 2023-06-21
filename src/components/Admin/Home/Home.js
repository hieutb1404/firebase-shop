import { useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import InfoBox from '~/components/InfoBox/InfoBox';
import { AiFillDollarCircle } from 'react-icons/ai';
import { BsCart4 } from 'react-icons/bs';
import { FaCartArrowDown } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { STORE_PRODUCTS, selectProducts } from '~/redux/slice/productSlice';
import {
  CALC_TOTAL_ORDER_AMOUNT,
  STORE_ORDERS,
  selectOrderHistory,
  selectTotalOrderAmount,
} from '~/redux/slice/orderSlice';
import useFetchCollection from '~/customHook/useFetchCollection';
import Chart from '~/components/Chart/Chart';

const cx = classNames.bind(styles);

const earningIcon = <AiFillDollarCircle size={30} color="#b624ff" />;
const productsIcon = <BsCart4 size={30} color="#1f93ff" />;
const ordersIcon = <FaCartArrowDown size={30} color="orangered" />;

function Home() {
  const product = useSelector(selectProducts);
  const orders = useSelector(selectOrderHistory);
  const totalOrderAmount = useSelector(selectTotalOrderAmount);
  const fbProducts = useFetchCollection('products cua admin trung hieu');
  const { data } = useFetchCollection('orders');

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      STORE_PRODUCTS({
        products: fbProducts.data,
      }),
    );
    dispatch(STORE_ORDERS(data));

    dispatch(
      CALC_TOTAL_ORDER_AMOUNT({
        amount: data,
      }),
    );
  }, [dispatch, fbProducts, data]);

  return (
    <div className={cx('home')}>
      <h2>Admin Home</h2>
      <div className={cx('info-box')}>
        <InfoBox cardClass={cx('card', 'card1')} title={'Earnings'} count={`$${totalOrderAmount}`} icon={earningIcon} />
        <InfoBox cardClass={cx('card', 'card2')} title={'Products'} count={product.length} icon={productsIcon} />
        <InfoBox cardClass={cx('card', 'card3')} title={'Orders'} count={`${orders.length}`} icon={ordersIcon} />
      </div>
      <div>
        <Chart />
      </div>
    </div>
  );
}

export default Home;
