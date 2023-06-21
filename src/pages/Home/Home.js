import { useEffect } from 'react';
import AdminOnlyRoute from '~/components/AdminOnlyRoute/AdminOnlyRoute';
import Product from '~/components/Product/Product';
import Slider from '~/components/Slider/Slider';

function Home() {
  // truyền đường URL hiện tại vào biến url
  const url = window.location.href;

  // dùng useEffect để thực hiện tự đông render chạy hàm
  // nếu ko dùng useEffect thì ta phải có chỗ dùng nó thì hàm mới chạy ví dụ onlick...
  useEffect(() => {
    // nếu link chứa home thì thực hiện if
    const scrollToProducts = () => {
      if (url.includes('home')) {
        window.scrollTo({
          top: 1000,
          behavior: 'smooth',
        });
        return;
      }
    };
    scrollToProducts();
  }, [url]);
  return (
    <div>
      <Slider />
      <Product />
    </div>
  );
}

export default Home;
