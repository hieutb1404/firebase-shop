import React, { useEffect, useState } from 'react';
import { PaymentElement, LinkAuthenticationElement, useStripe, useElements } from '@stripe/react-stripe-js';
import classNames from 'classnames/bind';
import styles from './CheckoutForm.module.scss';
import Card from '../Card/Card';
import CheckoutSummary from '../CheckoutSummary/CheckoutSummary';
import spinnerImg from '~/assets/images/spinner.jpg';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { selectEmail, selectUserID } from '~/redux/slice/authSlice';
import { CLEAR_CART, selectCartItems } from '~/redux/slice/cartSlice';
import { selectShippingAddress } from '~/redux/slice/checkoutSlice';
import { selectCartTotalAmount } from '~/redux/slice/cartSlice';
import { Timestamp, addDoc, collection } from 'firebase/firestore';
import { db } from '~/firebase/config';
import { useNavigate, useNavigationType } from 'react-router-dom';
const cx = classNames.bind(styles);

const CheckoutForm = () => {
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userID = useSelector(selectUserID);
  const userEmail = useSelector(selectEmail);
  const cartItems = useSelector(selectCartItems);
  const cartTotalAmount = useSelector(selectCartTotalAmount);
  const shippingAddress = useSelector(selectShippingAddress);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get('payment_intent_client_secret');

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case 'succeeded':
          setMessage('Payment succeeded!');
          break;
        case 'processing':
          setMessage('Your payment is processing.');
          break;
        case 'requires_payment_method':
          setMessage('Your payment was not successful, please try again.');
          break;
        default:
          setMessage('Something went wrong.');
          break;
      }
    });
  }, [stripe]);

  const saveOrder = () => {
    const today = new Date();
    const date = today.toDateString();
    const time = today.toLocaleTimeString();
    const orderConfig = {
      userID,
      userEmail,
      orderDate: date,
      orderTime: time,
      orderAmount: cartTotalAmount,
      orderStatus: 'Order Placed...',
      cartItems,
      shippingAddress,
      createAt: Timestamp.now().toDate(),
    };

    try {
      addDoc(collection(db, 'orders'), orderConfig);
      dispatch(CLEAR_CART());
      toast.success('order save');
      navigate('/checkout-success');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const comfirmPayment = await stripe
      .confirmPayment({
        elements,
        confirmParams: {
          // Make sure to change this to your payment completion page
          return_url: 'http://localhost:3000/checkout-success',
        },
        redirect: 'if_required',
      })
      .then((result) => {
        // ok - paymentIntent / bad - paymentIntent
        if (result.error) {
          toast.error(result.error.message);
          setMessage(result.error.message);
          return;
        }
        if (result.paymentIntent) {
          if (result.paymentIntent.status === 'succeeded') {
            setIsLoading(false);
            toast.success('Payment successful');
            saveOrder();
          }
        }
      });

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: 'tabs',
  };

  return (
    <div className={cx('checkout')}>
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <Card cardClass={cx('card')}>
            <CheckoutSummary />
          </Card>
        </div>
        <div>
          <Card cardClass={cx('card', 'pay')}>
            <h3>Sripe Checkout</h3>
            <PaymentElement id={cx('payment-element')} options={paymentElementOptions} />
            <button disabled={isLoading || !stripe || !elements} id="submit" className={cx('button')}>
              <span id="button-text">
                {isLoading ? <img src={spinnerImg} alt="Loading....." styles={{ width: '20px' }} /> : 'Pay now'}
              </span>
            </button>
            {/* Show any error or success messages */}
            {message && <div id={cx('payment-message')}>{message}</div>}
          </Card>
        </div>
      </form>
    </div>
  );
};
export default CheckoutForm;
