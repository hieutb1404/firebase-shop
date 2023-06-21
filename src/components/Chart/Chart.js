import classNames from 'classnames/bind';

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

import styles from './Chart.module.scss';
import Card from '../Card/Card';
import { selectOrderHistory } from '~/redux/slice/orderSlice';
import { useSelector } from 'react-redux';

const cx = classNames.bind(styles);

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: false,
      text: 'Chart.js Bar Chart',
    },
  },
};

function Chart() {
  const orders = useSelector(selectOrderHistory);

  // Create a new array of order status

  const array = [];

  orders.map((item) => {
    const { orderStatus } = item;
    array.push(orderStatus);
  });
  console.log(array);

  const getOrderCount = (arr, value) => {
    return arr.filter((n) => n === value).length;
  };

  // 4 vị trí của array được đưa vào q1,q2,q3,q4
  const [q1, q2, q3, q4] = ['Order Placed...', 'Processing...', 'Shipping...', 'Delivered'];

  // truyền đối số
  const placed = getOrderCount(array, q1);
  const processing = getOrderCount(array, q2);
  const shipped = getOrderCount(array, q3);
  const delivered = getOrderCount(array, q4);

  const data = {
    labels: ['Placed Orders', 'Processing', 'Shipping', 'Delivered'],
    datasets: [
      {
        label: 'Order count',
        data: [placed, processing, shipped, delivered],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  return (
    <div className={cx('charts')}>
      <Card cardClass={cx('card')}>
        <h3>Order Status Chart</h3>
        <Bar options={options} data={data} />;
      </Card>
    </div>
  );
}

export default Chart;
