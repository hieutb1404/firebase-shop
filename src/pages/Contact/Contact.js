import { useRef } from 'react';
import emailjs from '@emailjs/browser';
import classNames from 'classnames/bind';

import styles from './Contact.module.scss';
import Card from '~/components/Card/Card';
import { FaEnvelope, FaLocationArrow, FaPhoneAlt, FaTwitter } from 'react-icons/fa';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

function Contact() {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm('service_ezmmxyk', 'template_rdbn2zb', form.current, 'FdnNWG-iYimfMyNnu').then(
      (result) => {
        toast.success('gửi thành công!');
      },
      (error) => {
        toast.error(error.text);
      },
    );
    e.target.reset();
  };

  return (
    <div className={cx('grid', 'wide')}>
      <div className={cx('contact')}>
        <h2>Contact</h2>

        <div className={cx('section')}>
          <form ref={form} action="" onSubmit={sendEmail}>
            <Card cardClass={cx('card')}>
              <label>Name</label>
              <input type="text" name="user_name" placeholder="Full name" required />
              <label>Email</label>
              <input type="email" name="user_email" placeholder="Your active email" required />
              <label>Subject</label>
              <input type="text" name="subject" placeholder="subject" required />
              <textarea name="message" cols="30" rows="10"></textarea>
              <button className={cx('--btn', '--btn-primary')}>Send Message</button>
            </Card>
          </form>
          <div className={cx('details')}>
            <Card cardClass={cx('card2')}>
              <h3>Our Contact Information</h3>
              <p>Fill the form contact us via other channels listed below</p>
              <div className={cx('icons')}>
                <span>
                  <FaPhoneAlt />
                  <p>+84 962 193 221</p>
                </span>

                <span>
                  <FaEnvelope />
                  <p>Toilahieu2244@gmail.com</p>
                </span>

                <span>
                  <FaLocationArrow />
                  <p>Bùi Trung Hiếu</p>
                </span>

                <span>
                  <FaTwitter />
                  <p>@trunghieu</p>
                </span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
