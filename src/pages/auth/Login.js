import classNames from 'classnames/bind';
import { useState } from 'react';

import styles from './Auth.module.scss';
import loginImg from '~/assets/images/login.png';
import { Link, useNavigate } from 'react-router-dom';
import config from '~/config';
import { FaGoogle } from 'react-icons/fa';
import Card from '~/components/Card';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '~/firebase/config';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '~/components/Loader/Loader';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useSelector } from 'react-redux';
import { selectPreviousURL } from '~/redux/slice/cartSlice';

const cx = classNames.bind(styles);

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const previousURL = useSelector(selectPreviousURL);

  const redirectUser = () => {
    if (previousURL.includes('cart')) {
      return navigate('/cart');
    } else {
      navigate('/');
    }
  };

  const navigate = useNavigate();

  const loginUser = (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (email === 'hieuu@gmail.com') {
      setIsLoading(false);
      alert('tài khoản của bạn tạm thời bị khóa');
    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // const user = userCredential.user;
          setIsLoading(false);
          toast.success('Đăng nhập thành công!');
          redirectUser();
        })
        .catch((error) => {
          setIsLoading(false);
          toast.error(error.message);
        });
    }
  };

  // login with google
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    // nếu đúng là tài khoản google đã cung cấp và xác nhận thì đi vào .then
    signInWithPopup(auth, provider)
      .then((result) => {
        // const user = result.user;
        toast.success('Đăng nhập thành công!');
        redirectUser();
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className={cx('auth')}>
        <div className={cx('grid', 'wide')}>
          <div className={cx('row', 'fixedrow')}>
            <div className={cx('col', 'l-4')}>
              <div className={cx('img')}>
                <img src={loginImg} alt="Login" width={400} />
              </div>
            </div>
            <div className={cx('col', 'l-4')}>
              {/* card ở đây chính boder viền ngoài login (khung) */}
              <Card>
                <div className={cx('form')}>
                  <h2>Login</h2>
                  <form onSubmit={loginUser}>
                    <input
                      type="text"
                      placeholder="Email"
                      required
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
                    <button type="submit" className={cx('--btn --btn-primary --btn-primary-block')}>
                      Login
                    </button>
                    <div className={cx('links')}>
                      <Link to={config.routers.reset}>Reset Password</Link>
                    </div>
                    <p>-- or --</p>
                  </form>
                  {/* nếu đăng nhập = google thì button phải ở ngoài form vì google ko liên quan tới form */}
                  <button onClick={signInWithGoogle} className={cx('--btn --btn-danger --btn-primary-block')}>
                    <FaGoogle color="#fff" /> Login With Google
                  </button>
                  <span className={cx('register')}>
                    <p>Don't have an account?</p>
                    <Link to={config.routers.register}>Register</Link>
                  </span>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
