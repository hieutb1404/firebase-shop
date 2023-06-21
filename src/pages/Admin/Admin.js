import classNames from 'classnames/bind';

import styles from './Admin.module.scss';
import Navbar from '~/components/Admin/Navbar/Navbar';
import { Route, Routes } from 'react-router-dom';
import Home from '~/components/Admin/Home/Home';
import ViewProducts from '~/components/Admin/ViewProducts/ViewProducts';
import AddProduct from '~/components/Admin/AddProduct/AddProduct';
import Orders from '~/components/Admin/Orders/Orders';
import { AdminOnlyLink } from '~/components/AdminOnlyRoute/AdminOnlyRoute';
import OrderDetails from '~/components/Admin/OrderDetails/OrderDetails';

const cx = classNames.bind(styles);

function Admin() {
  return (
    <AdminOnlyLink>
      <div className={cx('admin')}>
        <div className={cx('navbar')}>
          <Navbar />
        </div>
        <div className={cx('content')}>
          {/* các route này nằm trên router admin */}
          {/* vì đã có route cha là admin nên các routes này có thể đè lên trước nó mà ko sợ bị trùng route người dùng hay người dùng có thể truy cập được  */}
          <Routes>
            <Route path="home" element={<Home />} />
            <Route path="all-products" element={<ViewProducts />} />
            <Route path="add-product/:id" element={<AddProduct />} />
            <Route path="orders" element={<Orders />} />
            <Route path="order-details/:id" element={<OrderDetails />} />
          </Routes>
        </div>
      </div>
    </AdminOnlyLink>
  );
}

export default Admin;
