import classNames from 'classnames/bind';
import { useState } from 'react';

import styles from './Auth.module.scss';
import resetImg from '~/assets/images/forgot.png';
import { Link } from 'react-router-dom';
import config from '~/config';
import Card from '~/components/Card';
import { toast } from 'react-toastify';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '~/firebase/config';
import Loader from '~/components/Loader/Loader';

const cx = classNames.bind(styles);

function Reset() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const resetPassword = (e) => {
    e.preventDefault();
    setIsLoading(true);
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setIsLoading(false);
        toast.success('Kiểm tra email của bạn để xác thực reset mật khẩu');
      })

      .catch((error) => {
        setIsLoading(false);
        toast.error('Không có email này');
      });
  };

  return (
    <>
      {isLoading && <Loader />}
      <div>
        <div className={cx('auth')}>
          <div className={cx('grid', 'wide')}>
            <div className={cx('row', 'fixedrow')}>
              <div className={cx('col', 'l-4')}>
                <div className={cx('img')}>
                  <img src={resetImg} alt="Login" width={400} />
                </div>
              </div>
              <div className={cx('col', 'l-4')}>
                {/* card ở đây chính boder viền ngoài login (khung) */}
                <Card>
                  <div className={cx('form')}>
                    <h2>Reset Password</h2>
                    <form onSubmit={resetPassword}>
                      <input
                        type="text"
                        placeholder="Email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <button type="submit" className={cx('--btn --btn-primary --btn-primary-block')}>
                        Reset Password
                      </button>
                      <div className={cx('links')}>
                        <p>
                          <Link to={config.routers.login}>-Login</Link>
                        </p>

                        <p>
                          <Link to={config.routers.register}>Register-</Link>
                        </p>
                      </div>
                    </form>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Reset;
