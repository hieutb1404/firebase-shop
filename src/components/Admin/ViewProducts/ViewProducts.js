import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';

import styles from './ViewProducts.module.scss';
import { toast } from 'react-toastify';
import { db, storage } from '~/firebase/config';
import { collection, doc, setDoc, query, onSnapshot, orderBy, deleteDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { ref, deleteObject } from 'firebase/storage';
import Loader from '~/components/Loader/Loader';
import Notiflix from 'notiflix';
import { useDispatch, useSelector } from 'react-redux';
import { selectProducts, STORE_PRODUCTS } from '~/redux/slice/productSlice';
import useFetchCollection from '~/customHook/useFetchCollection';
import Search from '~/components/Search/Search';
import { FILTER_BY_SEARCH, selectFilteredProducts } from '~/redux/slice/filterSlice';
import Pagination from '~/components/Pagination/Pagination';

const cx = classNames.bind(styles);

function ViewProducts() {
  const [search, setSearch] = useState('');
  // nhận tham số là tên product trên firebase mà mình đã đặt ở add product
  const { data, isLoading } = useFetchCollection('products cua admin trung hieu');
  // sau khi dispatch xong nó lại lấy lại dữ liệu trong STORE_PRODUCTS và đổ vào biến mới là const products = useSelector(selectProducts);
  const products = useSelector(selectProducts);
  const filteredProducts = useSelector(selectFilteredProducts);

  //Pagination state

  const [currentPage, SetCurrentPage] = useState(1);
  // productPerPage là số lượng sản phẩm trên một trang
  const [productPerPage, setProductPerPage] = useState(3);
  // Get current products
  const indexOfLastProduct = currentPage * productPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productPerPage;
  // slice nhận 2 vị trí cắt, ví trí 1 cắt chính nó và những thằng bên trái nó
  // vị trí 2: giữ nguyên nó và cắt những thằng bên phải nó
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  // fillteredProduct sẽ lấy ra toàn bộ sản phẩm hiện tại và sản phẩm sau khi được lọc

  const dispatch = useDispatch();

  //getProducts là lấy dữ liệu từ trên firebase đc gọi là dữ liệu ngoài
  // thằng useState sau khi cập nhật và lấy dữ đưa vào chỗ cần hiện dữ liệu đó, thì muốn nó hiện ra ngoài, render ra ngoài ta phải dùng useEffect()
  // giống như useEffect có nhiệm vụ là truy vấn thằng useState, sau khi t dùng set của useEffect nó sẽ chưa render ra vội, mà phải chờ thằng useEffect đưa nó ra
  // useState ... setData cũng như là kiểu chỉ là cập nhật dữ liệu riêng biệt đó.. còn render ra ngoài thì phải cần useEffect
  // và nó sẽ cập nhật liên tục khi có dữ liệu mới chứ k phải thằng setData trong useState
  // tóm lại useEffect là bố của useState... useState muốn làm gì phải hỏi bố và có bố

  // sau khi effect đổ dữ liệu cập nhật vào data (thì data sẽ có dữ liệu)
  // sang bên này muốn đổ dữ liệu vào story thì dispatch vào đc vào trong useEffect thì nó sẽ cập nhật đưa dữ liệu vào STRORE_PRODUCTS
  // sau khi dispatch xong nó lại lấy lại dữ liệu trong STORE_PRODUCTS và đổ vào biến mới là const products = useSelector(selectProducts);
  useEffect(() => {
    dispatch(
      STORE_PRODUCTS({
        products: data,
      }),
    );
  }, [dispatch, data]);

  useEffect(() => {
    dispatch(
      FILTER_BY_SEARCH({
        products,
        search,
      }),
    );
  }, [dispatch, products, search]);

  // const getProducts = () => {
  //   setIsLoading(true);

  //   try {
  //     //Nhận một tài liệu
  //     // tham số 2 phải đúng với đúng tên mình addProduct gửi lên
  //     // collection là để tryền đối số get dữ liệu về
  //     const productRef = collection(db, 'products cua admin trung hieu');
  //     //Đặt hàng và giới hạn dữ liệu
  //     // createAt, desc là biến trên data
  //     // sau khi nhận được dữ liệu về ta truy vấn thực hiện nó là để comfirm là đã nhận
  //     const q = query(productRef, orderBy('createAt', 'desc'));

  //     //Nghe nhiều tài liệu trong một bộ sưu tập
  //     // trong hàm onSnapshot ta nhận vào 2 đối số là q và 1 function...
  //     // sau khi truyền đối số nó sẽ tự đồng chuyển về hàm onSnapshot trên
  //     // còn hàm snapshot(đối số 2) là ta nhận đối số từ server về chứ k phải ta truyền đối số đi
  //     // phía server đã xử lý việc này
  //     onSnapshot(q, (snapshot) => {
  //       // snapshow.docs ... docs ở đây là dữ liệu sẵn trong firebase console.log(snapshot) ra là nhìn thấy
  //       // trong chấm.docs có cả id product

  //       console.log(snapshot.docs);
  //       const allProducts = snapshot.docs.map((doc) => ({
  //         id: doc.id,
  //         ...doc.data(),
  //       }));
  //       console.log(allProducts);
  //       setProduct(allProducts);
  //       setIsLoading(false);
  //       dispatch(
  //         STORE_PRODUCTS({
  //           products: allProducts,
  //         }),
  //       );
  //     });
  //   } catch (error) {
  //     setIsLoading(false);
  //     toast.error(error.message);
  //   }
  // };

  // tham số đã đc truyền đối số  với dữ liệu product
  const confirmDelete = (id, imageURL) => {
    Notiflix.Confirm.show(
      'Xóa sản phẩm!!!!',
      'Bạn có thật sự muốn xóa?',
      'Delete',
      'Cancel',
      function okCb() {
        //lấy lại đối số truyền vào từ confirmdelete truyền lại vào deleteproduct
        deleteProduct(id, imageURL);
      },
      function cancelCb() {
        alert('bạn đã hủy bỏ xóa!');
      },
      {
        width: '320px',
        borderRadius: '3px',
        titleColor: 'orangered',
        okButtonBackground: 'orangered',
        cssAnimationStyle: 'zoom',
        // etc...
      },
    );
  };

  const deleteProduct = async (id, imageURL) => {
    try {
      //Xóa tài liệu
      await deleteDoc(doc(db, 'products cua admin trung hieu', id));
      // Tạo tham chiếu đến file cần xóa
      const desertRef = ref(storage, imageURL);

      await deleteObject(desertRef);

      toast.success('Xóa thành công!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className={cx('table')}>
        <h2>All Products</h2>
        <div className={cx('search')}>
          <p>
            <b>{currentProducts.length}</b> Products found
          </p>
          <Search value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {products.length === 0 ? (
          <p>Hiện không tìm thấy sản phẩm.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Stt</th>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentProducts.map((item, index) => {
                // nếu t gán luôn các giá trị có sẵn trng item thì khi gọi ta ko cần item.id..item.name .....
                const { id, name, price, imageURL, category } = item;

                return (
                  <tr key={id}>
                    {/* số thứ tự tính từ số 1 nên phải index + 1, nếu có mỗi index thì spham thứ nhất bắt đầu bằng stt 0 */}
                    <td>{index + 1}</td>
                    <td>
                      <img src={imageURL} alt={name} style={{ width: '100px' }} />
                    </td>
                    <td>{name}</td>
                    <td>{category}</td>
                    <td>{`$${price}`}</td>
                    <td className={cx('icons')}>
                      <Link to={`/admin/add-product/${id}`}>
                        <FaEdit size={20} color="green" />
                      </Link>
                      &nbsp;
                      <FaTrashAlt size={18} color="red" onClick={() => confirmDelete(id, imageURL)} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        <Pagination
          currentPage={currentPage}
          setCurrentPage={SetCurrentPage}
          // productPerPage là số lượng sản phẩm trên một trang
          productPerPage={productPerPage}
          totalProducts={filteredProducts.length}
        />
      </div>
    </>
  );
}

export default ViewProducts;
