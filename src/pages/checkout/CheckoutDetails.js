import { useState } from 'react';
import classNames from 'classnames/bind';
//thêm thư viện quốc gia
import { CountryDropdown } from 'react-country-region-selector';

import styles from './CheckoutDetails.module.scss';
import Card from '~/components/Card/Card';
import { useDispatch } from 'react-redux';
import { SAVE_BILLING_ADDRESS, SAVE_SHIPPING_ADDRESS } from '~/redux/slice/checkoutSlice';
import { useNavigate } from 'react-router-dom';
import CheckoutSummary from '~/components/CheckoutSummary/CheckoutSummary';

const cx = classNames.bind(styles);

const initialAddressState = {
  name: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postal_code: '',
  country: '',
  phone: '',
};

function CheckoutDetails() {
  // nếu dùng ...initialAddressState thì khi gọi t ko cần phải lặp nữa mà lấy được toàn bộ object trong nó
  const [shippingAddress, setShippingAddress] = useState({ ...initialAddressState });
  const [billingAddress, setBillingAddress] = useState({ ...initialAddressState });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleShipping = (e) => {
    const { name, value } = e.target;
    setShippingAddress({
      ...shippingAddress,
      [name]: value,
    });
  };

  const handleBilling = (e) => {
    // lắng nghe sự kiện từ name và value và truyền vào name và value
    const { name, value } = e.target;
    setBillingAddress({
      ...billingAddress,
      // sau khi lắng nghe sự kiện thì trueyenf value vào name (name ở đây là từng tên khai báo trong input và sau khi lấy tên khai báo đó xong thì truyền dữ liệu vào tên khai báo đó)
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(SAVE_SHIPPING_ADDRESS(shippingAddress));
    dispatch(SAVE_BILLING_ADDRESS(billingAddress));
    navigate('/checkout');
  };

  return (
    <div>
      <div className={cx('grid', 'wide')}>
        <div className={cx('checkout')}>
          <h2>Chekcout Details</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <Card cardClass={cx('card')}>
                <h3>Shipping Address</h3>
                <label>Recipient Name</label>
                <input
                  type="text"
                  placeholder="Recipient Name"
                  name="name"
                  value={shippingAddress.name}
                  onChange={(e) => handleShipping(e)}
                />

                <label>Address line 1</label>
                <input
                  type="text"
                  placeholder="Address line 1"
                  name="line1"
                  value={shippingAddress.line1}
                  onChange={(e) => handleShipping(e)}
                />

                <label>Address line 2</label>
                <input
                  type="text"
                  placeholder="Address line 2"
                  name="line2"
                  value={shippingAddress.line2}
                  onChange={(e) => handleShipping(e)}
                />

                <label>City</label>
                <input
                  type="text"
                  placeholder="City"
                  name="city"
                  value={shippingAddress.city}
                  onChange={(e) => handleShipping(e)}
                />

                <label>State</label>
                <input
                  type="text"
                  placeholder="State"
                  name="state"
                  value={shippingAddress.state}
                  onChange={(e) => handleShipping(e)}
                />

                <label>Postal code</label>
                <input
                  type="text"
                  placeholder="Postal code"
                  name="postal_code"
                  value={shippingAddress.postal_code}
                  onChange={(e) => handleShipping(e)}
                />
                {/* COUNTRY INPUT */}
                <CountryDropdown
                  valueType="short"
                  className={cx('select')}
                  value={shippingAddress.country}
                  onChange={(val) =>
                    handleShipping({
                      target: {
                        name: 'country',
                        value: val,
                      },
                    })
                  }
                />
                <label>Phone</label>
                <input
                  type="text"
                  placeholder="Phone"
                  name="phone"
                  value={shippingAddress.phone}
                  onChange={(e) => handleShipping(e)}
                />
              </Card>
              {/* billing */}
              <Card cardClass={cx('card')}>
                <h3>Blling Address</h3>
                <label>Recipient Name</label>
                <input
                  type="text"
                  placeholder="Name"
                  name="name"
                  value={billingAddress.name}
                  onChange={(e) => handleBilling(e)}
                />

                <label>Address line 1</label>
                <input
                  type="text"
                  placeholder="Address line 1"
                  name="line1"
                  value={billingAddress.line1}
                  onChange={(e) => handleBilling(e)}
                />

                <label>Address line 2</label>
                <input
                  type="text"
                  placeholder="Address line 2"
                  name="line2"
                  value={billingAddress.line2}
                  onChange={(e) => handleBilling(e)}
                />

                <label>City</label>
                <input
                  type="text"
                  placeholder="City"
                  name="city"
                  value={billingAddress.city}
                  onChange={(e) => handleBilling(e)}
                />

                <label>State</label>
                <input
                  type="text"
                  placeholder="State"
                  name="state"
                  value={billingAddress.state}
                  onChange={(e) => handleBilling(e)}
                />

                <label>Postal code</label>
                <input
                  type="text"
                  placeholder="Postal code"
                  name="postal_code"
                  value={billingAddress.postal_code}
                  onChange={(e) => handleBilling(e)}
                />
                {/* COUNTRY INPUT */}
                <CountryDropdown
                  valueType="short"
                  className={cx('select')}
                  value={billingAddress.country}
                  onChange={(val) =>
                    handleBilling({
                      target: {
                        name: 'country',
                        value: val,
                      },
                    })
                  }
                />
                <label>Phone</label>
                <input
                  type="text"
                  placeholder="Phone"
                  name="phone"
                  value={billingAddress.phone}
                  onChange={(e) => handleBilling(e)}
                />

                <button type="submit" className={cx('--btn', '--btn-primary')}>
                  Proceed To Checkout
                </button>
              </Card>
            </div>
            <div>
              <Card cardClass={cx('card')}>
                <CheckoutSummary />
              </Card>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CheckoutDetails;
