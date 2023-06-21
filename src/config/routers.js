const routers = {
  home: '/home',
  cart: '/cart',
  admin: '/admin/*',
  contact: '/contact',
  orderHistory: '/order-history',
  orderdetails: '/order-details/:id',
  reviewproduct: '/review-product/:id',
  login: '/login',
  register: '/register',
  reset: '/reset',
  notfound: '/*',
  productdetails: '/product-details/:id',
  checkoutdetails: '/checkout-details',
  checksuccess: 'checkout-success',
  checkout: '/checkout',
};
export default routers;
