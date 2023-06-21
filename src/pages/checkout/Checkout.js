import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import {
  CALCULATE_SUBTOTAL,
  CALCULATE_TOTAL_QUANTITY,
  selectCartItems,
  selectCartTotalAmount,
} from '~/redux/slice/cartSlice';
import { selectEmail } from '~/redux/slice/authSlice';
import { selectBillingAddress, selectShippingAddress } from '~/redux/slice/checkoutSlice';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import styles from './CheckoutDetails.module.scss';
import CheckoutForm from '~/components/CheckoutForm/CheckoutForm';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK);

const cx = classNames.bind(styles);

function Checkout() {
  const [message, setMessage] = useState('Initializing checkout');
  const [clientSecret, setClientSecret] = useState('');

  const cartItems = useSelector(selectCartItems);
  const totalAmount = useSelector(selectCartTotalAmount);
  const customerEmail = useSelector(selectEmail);

  const shippingAddress = useSelector(selectShippingAddress);
  const billingAddress = useSelector(selectBillingAddress);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(CALCULATE_SUBTOTAL());
    dispatch(CALCULATE_TOTAL_QUANTITY());
  }, [dispatch, cartItems]);

  const description = `Hshop payment: email: ${customerEmail}, Amount: ${totalAmount}`;

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    // lấy và đưa dữ liệu về fetch api
    fetch('http://localhost:4242/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cartItems,
        userEmail: customerEmail,
        shipping: shippingAddress,
        billding: billingAddress,
        description,
      }),
    })
      // sau khi đưa dữ liệu vào thì biến nó thành dạng json rồi mới chuyển về server để xử lý
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        //Nếu res.ok bằng false, res.json() sẽ trả về một promise bị từ chối với nội dung lỗi được phân tích dưới dạng JSON bởi phương thức .json() và được xử lý bởi .then() tiếp theo.
        return res.json().then((json) => Promise.reject(json));
      })
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((error) => {
        setMessage('Failed to initiallize checkout');
        toast.error('something went wrong');
      });
  }, []);

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };
  return (
    <>
      <div className={cx('grid', 'wide')}>
        {!clientSecret && <h3>{message}</h3>}
        {clientSecret && (
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        )}
      </div>
    </>
  );
}

export default Checkout;
