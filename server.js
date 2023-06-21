require('dotenv').config();

const express = require('express');
const cors = require('cors');
// sử dụng key môi trường đã tạo sẵn trong file .env
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
const app = express();
app.use(cors());
app.use(express.json());

// khi get nhận được / từ website  thì nó sẽ trả về kết quả trong đó
// vd: người dùng vào page có link '/' thì nó sẽ hiểu được và nhận về còn các link khác thì k nhận đc
app.get('/', (req, res) => {
  res.send('Welcome to shop!');
});

const array = [];
const calculateOrderAmount = (items) => {
  items.map((item) => {
    const { price, cartQuantity } = item;
    const cartItemAmount = price * cartQuantity;
    return array.push(cartItemAmount);
  });
  const totalAmount = array.reduce((a, b) => {
    return a + b;
  }, 0);

  return totalAmount * 100;
};

app.post('/create-payment-intent', async (req, res) => {
  const { items, shipping, description } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: 'usd',
    automatic_payment_methods: {
      enabled: true,
    },
    description,
    shipping: {
      address: {
        line1: shipping.line1,
        line2: shipping.line2,
        city: shipping.city,
        postal_code: shipping.postal_code,
      },
      name: shipping.name,
      phone: shipping.phone,
    },
    // receipt_email : customerEmail
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});
//, biến process.env.PORT sẽ được định nghĩa từ biến PORT trong file .env. File .env là một file cấu hình được sử dụng để lưu trữ các biến môi trường (environment variables) trong ứng dụng Node.js. Các biến này được sử dụng để lưu trữ thông tin như cổng kết nối, đường dẫn tới database, khóa bí mật và các cấu hình khác. Khi một ứng dụng Node.js được chạy, các biến trong file .env sẽ được tải vào trong biến môi trường của hệ thống, và có thể được sử dụng bởi ứng dụng bằng cách sử dụng process.env. Nếu biến PORT không được định nghĩa trong file .env, giá trị mặc định là 4242 sẽ được sử dụng.
// nếu process.env.PORT không tồn tại(false) thì sẽ lấy 4242
// || đại diện cho false
// && đại diện cho true
const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Node server listening on port ${PORT}`));
