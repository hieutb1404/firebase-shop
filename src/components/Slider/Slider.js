import { useEffect, useState } from 'react';

import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';
import { sliderData } from './Slider-data';
import './Slider.scss';
function Slider() {
  // useState(0) ở đây là chọn dữ liệu object thứ nhất trong slider-data.js
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderLength = sliderData.length;

  const autoScroll = true;
  let slideInterval;
  let intervalTime = 5000;

  const nextSlide = () => {
    // vì ở trên đã khai báo silderData.length;
    // length - 1 sẽ lấy phần tử cuối cùng của mảng
    // ở đấy sẽ hiểu là nếu là phần từ cuối cùng của mảng ấn tiếp sẽ trở về 0
    setCurrentSlide(currentSlide === sliderLength - 1 ? 0 : currentSlide + 1);
  };
  const prevSlide = () => {
    // ngước lại nếu slider đang ở phần tử 0 thì sẽ lấy slideLeng - 1(là phần tử cuối cùng của mảng)
    setCurrentSlide(currentSlide === 0 ? sliderLength - 1 : currentSlide - 1);
  };
  // để không bị delay mới vào ta đặt set nó = 0 lấy ra phần tử dữ liệu đầu trong mảng
  // như thế sẽ không bị delay ảnh khi tự auto slide
  useEffect(() => {
    setCurrentSlide(0);
  }, []);

  // function auto() {
  //   slideInterval = setInterval(nextSlide, intervalTime);
  // }

  useEffect(() => {
    if (autoScroll) {
      function auto() {
        slideInterval = setInterval(nextSlide, intervalTime);
      }
      auto();
    }
    return () => clearInterval(slideInterval);
  }, [currentSlide, slideInterval, autoScroll]);
  return (
    <div className="slider">
      <AiOutlineArrowLeft className="arrow prev" onClick={prevSlide} />
      <AiOutlineArrowRight className="arrow next" onClick={nextSlide} />

      {sliderData.map((slide, index) => {
        // nếu đặt slice = tên tương tự bên trong của nó
        // thì khi t gọi ko cần slide.image ..... mà ghi luôn là image
        const { image, heading, desc } = slide;
        return (
          // ta gán currentSlide === index để nó đi đúng vị trí chuyển slide khi currentSlide + 1 thì nó sẽ ra 1 kết quả rồi so sánh bên trong index có kết quả đó không
          // ví dụ currentSilde hiện tại là 0 cộng thêm 1 là 2, và nó sẽ so sánh xem index từ dữ liêu sliderData có phần tử là 2 ko nếu có thì thực hiện thêm current
          <div key={index} className={index === currentSlide ? 'slide current' : 'slide'}>
            {index === currentSlide && (
              <>
                <img src={image} alt="slide " />
                <div className="content-slide">
                  <h2>{heading}</h2>
                  <p>{desc}</p>
                  <hr />
                  <a href="#product" className="--btn --btn-primary">
                    Shop now
                  </a>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Slider;
