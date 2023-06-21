import classNames from 'classnames/bind';
import { useState } from 'react';

import styles from './Pagination.module.scss';

const cx = classNames.bind(styles);

function Pagination({ currentPage, setCurrentPage, productPerPage, totalProducts }) {
  const pageNumber = [];
  const totalPages = totalProducts / productPerPage;
  // giới hạn page Number shown
  const [pageNumberLimit, setPageNumberLimit] = useState(3);
  const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(3);
  const [minPageNumberLimit, setMinPageNumberLimit] = useState(0);
  //phân trang

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  //nút next trang
  const paginateNext = () => {
    setCurrentPage(currentPage + 1);
    if (currentPage + 1 > maxPageNumberLimit) {
      setMaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
      setMinPageNumberLimit(minPageNumberLimit + pageNumberLimit);
      // sau khi set lại setMax nếu quá 3 trang thì sẽ + thành 6
      /* kết quả bây giờ sẽ là 6 ở setMax và lọt về điều kiện  
        if (number < maxPageNumberLimit + 1 && number > minPageNumberLimit) 
        ở dưới
        và điều kiện này maxPageNumberLimit sẽ = 6 và minPageNumberLimit =3
        và nó chỉ hiện số chân trang nhỏ hơn 6 và nhỏ lớn hơn 3 còn lại thì ẩn
        **/
    }
  };
  //nút lùi trang
  const paginatePrev = () => {
    setCurrentPage(currentPage - 1);
    if ((currentPage - 1) % pageNumberLimit == 0) {
      setMaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
      setMinPageNumberLimit(minPageNumberLimit - pageNumberLimit);
      /*
        còn ở đây nếu trang hiện tại mà chia cho pageNumberLimit == 0
        thì setMax lại: khi đó maxPageNumberLimit = 6 và minPageNumberLimit =3 với điều kiện next ở trên
        ta set lại max là 6 - 3 = 3 và min 3-3 = 0
        về lại điều kiện ban đầu của useState Max và Min mà mình đã điền giá trị trước đó
        if (number < maxPageNumberLimit + 1 && number > minPageNumberLimit) 
        **/
    }
  };

  //Math.ceil làm tròn bất cứ chấm phẩy nào đó.. làm tròn lên thành số nguyên
  // vd: 2.1 thành 3 ....
  //Hàm Math.ceil được sử dụng để làm tròn số trang lên thành số nguyên, giúp đảm bảo không có trang nào bị bỏ lỡ.
  //  vòng lặp for, i chính là vị trí trong mảng mà ta cần lặp
  // ở đây totalProduct chính là sản phẩm trong mảng lấy từ prop từ fillteredProduct.length ở ngoài
  // lưu ý muốn lặp sản phẩm trong mảng thì ta cần .length để xem độ dài phần tử của mảng

  for (let i = 1; i <= Math.ceil(totalProducts / productPerPage); i++) {
    // i là số đã được lặp qua chứ ko phải là sản phẩm
    // nếu muốn thêm sp vào mảng mới thì ta cần lấy biến sản phẩm được lặp đó và thêm[i] vào
    /* giả dụ product.length được lặp qua for
     thì ta có thể đẩy sp vào pageNumber.push(product[i]) 
     như này thì ta sẽ có sp. Còn để mỗi pageNumber.push(i) thôi thì chỉ có số đã lặp
     **/

    pageNumber.push(i);
  }
  console.log(pageNumber);
  return (
    <ul className={cx('pagination')}>
      {/* vì trang số trong mảng pageNumber = phần tử thứ nhất là phần tử 0 nên là ở đây trang 1 = 0 nên ta lấy 0 đưa vào */}
      <li onClick={() => paginatePrev()} className={currentPage === pageNumber[0] ? cx('hidden') : null}>
        Prev
      </li>

      {pageNumber.map((number) => {
        // điều kiện hiển thị số trang ra ngoài trên tổng các số trang khác
        //vd: mình giới hạn chỉ hiện ra 3  chân trang thì điền vào useState của Max = 3 thì nó chỉ hiện ra 3 trang thôi tương tượng min
        if (number < maxPageNumberLimit + 1 && number > minPageNumberLimit) {
          return (
            // nếu trang hiện tại = number hiện tại trong mảng thì active sáng màu để người dùng nhận biết mình đang ở trang nào
            <li key={number} onClick={() => paginate(number)} className={currentPage === number ? cx('active') : null}>
              {number}
            </li>
          );
        }
      })}
      <li
        onClick={() => paginateNext()}
        className={currentPage === pageNumber[pageNumber.length - 1] ? cx('hidden') : null}
      >
        Next
      </li>
      <p>
        <b className={cx('page')}>{`page ${currentPage}`}</b>

        <span>{` of `}</span>

        <b>{`${Math.ceil(totalPages)}`}</b>
      </p>
    </ul>
  );
}

export default Pagination;
