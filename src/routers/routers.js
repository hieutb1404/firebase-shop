import Config from '~/config';

import Home from '~/pages/Home';
import Cart from '~/pages/Cart';
import Contact from '~/pages/Contact';
import orderHistory from '~/pages/orderHistory';
import Login from '~/pages/auth/Login';
import Register from '~/pages/auth/Register';
import Reset from '~/pages/auth/Reset';
import NotFound from '~/pages/NotFound/NotFound';
import Admin from '~/pages/Admin';
import CheckoutDetails from '~/pages/checkout/CheckoutDetails';
import Checkout from '~/pages/checkout/Checkout';
import CheckoutSuccess from '~/pages/checkout/CheckoutSuccess';
import OrderHistory from '~/pages/orderHistory/OrderHistory';
import OrderDetails from '~/pages/OrderDetails/OrderDetails';
import ReviewProducts from '~/components/ReviewProducts/ReviewProducts';

import ProductDetails from '~/components/Product/ProductDetails/ProductDetails';

const publicRoutes = [
  { path: Config.routers.home, component: Home },
  { path: Config.routers.cart, component: Cart },
  { path: Config.routers.contact, component: Contact },
  { path: Config.routers.orderHistory, component: orderHistory },
  { path: Config.routers.login, component: Login },
  { path: Config.routers.register, component: Register },
  { path: Config.routers.admin, component: Admin },
  { path: Config.routers.reset, component: Reset },
  { path: Config.routers.productdetails, component: ProductDetails },
  { path: Config.routers.checkoutdetails, component: CheckoutDetails },
  { path: Config.routers.checkout, component: Checkout },
  { path: Config.routers.checksuccess, component: CheckoutSuccess },
  { path: Config.routers.orderHistory, component: OrderHistory },
  { path: Config.routers.orderdetails, component: OrderDetails },
  { path: Config.routers.reviewproduct, component: ReviewProducts },
  { path: Config.routers.notfound, component: NotFound },
];
const privateRoutes = [];
export { publicRoutes, privateRoutes };
