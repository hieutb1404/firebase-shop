import classNames from 'classnames/bind';

import styles from './Auth.module.scss';
import registerImg from '~/assets/images/register.png';
import { Link, useNavigate } from 'react-router-dom';
import config from '~/config';
import Card from '~/components/Card';
import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '~/firebase/config';
import Loader from '~/components/Loader/Loader';

const cx = classNames.bind(styles);

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const registerUser = (e) => {
    e.preventDefault();
    if (password !== cpassword) {
      toast.error('Mật khẩu không khớp!');
    }
    // khi bấm đăng ký loading sẽ quay
    setIsLoading(true);
    // sau khi đc gửi lên sever loading sẽ = false để ngừng loading
    // nếu ko setIsloading = false khi đăng nhập thành công thì nó sẽ quay loading mãi
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // const user = userCredential.user;
        setIsLoading(false);
        toast.success('Đăng ký tài khoản thành công!');
        navigate('/login');
      })
      .catch((error) => {
        toast.error(error.message);
        setIsLoading(false);
      });
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className={cx('auth')}>
        <div className={cx('grid', 'wide')}>
          <div className={cx('row', 'fixedrow')}>
            <div className={cx('col', 'l-4')}>
              {/* card ở đây chính boder viền ngoài login (khung) */}
              <Card>
                <div className={cx('form')}>
                  <h2>Register</h2>
                  <form onSubmit={registerUser}>
                    <input
                      type="text"
                      placeholder="Email"
                      required
                      // sau khi cập nhật xong thì value mới có giá trị đó
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                      type="password"
                      placeholder="Comfirm Password"
                      required
                      value={cpassword}
                      onChange={(e) => setCPassword(e.target.value)}
                    />
                    <button type="submit" className={cx('--btn --btn-primary --btn-primary-block')}>
                      Register
                    </button>
                  </form>
                  <span className={cx('register')}>
                    <p>Already an account?</p>
                    <Link to={config.routers.login}>Login</Link>
                  </span>
                </div>
              </Card>
            </div>
            <div className={cx('col', 'l-4')}>
              <div className={cx('img')}>
                <img src={registerImg} alt="Login" width={500} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
