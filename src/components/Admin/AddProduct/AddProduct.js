import classNames from 'classnames/bind';
import { useState } from 'react';
import styles from './AddProducts.module.scss';
import Card from '~/components/Card';
import { db, storage } from '~/firebase/config';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { toast } from 'react-toastify';
import { collection, addDoc, Timestamp, setDoc, doc } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '~/components/Loader/Loader';
import { selectProducts } from '~/redux/slice/productSlice';
import { useSelector } from 'react-redux';

const cx = classNames.bind(styles);

const categories = [
  { id: 1, name: 'Laptop' },
  { id: 2, name: 'Electronics' },
  { id: 3, name: 'Fashion' },
  { id: 4, name: 'Phone' },
];

const initialState = {
  name: '',
  imageURL: '',
  price: 0,
  category: '',
  brand: '',
  desc: '',
};

function AddProducts() {
  // productEdit thực chất chỉ là chỗ chứa dữ liệu cũ
  const { id } = useParams();
  const productSelect = useSelector(selectProducts);
  // sau khi cho id trong dữ liệu gốc = id trên URL, thì thằng productEdit sẽ có đc toàn bộ dữ liệu từ id đó, nên nó có thể truy cập đc ảnh hay tên sp hay desc .....
  // productEdit thực chất chỉ là chỗ chứa dữ liệu cũ
  const productEdit = productSelect.find((item) => item.id === id);
  console.log(productEdit);
  // thằng useParams này sẽ lấy id ở URL có /:id (trang hiện tại là id bao nhiêu thì nó hiểu /:id và lấy nó luôn)
  //add-product/:id (router bên admin)
  console.log(id);
  const [product, setProduct] = useState(() => {
    // ...init dữ liệu mới,,, còn productEdit sẽ chứa đc dữ liệu cũ vì đã đc lấy ra từ useSelector(selectProducts) và đc lọc đúng id từ find
    const newState = detectForm(id, { ...initialState }, productEdit);
    return newState;
  });

  // nếu truyền quá trình chạy = 0 thì dữ liệu nó sẽ đi vào là dữ liệu số
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  function detectForm(id, f1, f2) {
    // nếu URL = ADD thì sẽ trả đối số thứ 2 được truyền vào ở trên là ...initialState. mà initialState là 1 dữ liệu trống để người dùng nhập
    if (id === 'ADD') {
      return f1;
    }
    // còn id = id product thì sẽ trả đối số thứ 3 là productEdit được get dữ liệu cũ từ redux ra
    return f2;
  }

  // sau khi truyền đối số từ onChange input ta trả về tham số và e.target

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // ...product chính là các dữ liệu trước nó nữa và name: value là tên name thay cho value
    // cập nhất khi có giá trị mới đc truyền vào
    setProduct({ ...product, [name]: value });
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    // console.log(file);
    // khi ta console ra t sẽ thấy name của ảnh khi t chọn 1 ảnh nào đó
    // vì vậy để up lên server file phải chấm name để lấy ra tên ảnh và đưa lên firebase

    const storageRef = ref(storage, `hshop/${Date.now()}${file.name}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        toast.error(error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setProduct({ ...product, imageURL: downloadURL });
          toast.success('upload ảnh thành công');
        });
      },
    );
  };

  const addProduct = (e) => {
    e.preventDefault();
    console.log(product);

    setIsLoading(true);

    try {
      const docRef = addDoc(collection(db, 'products cua admin trung hieu'), {
        name: product.name,
        imageURL: product.imageURL,
        price: Number(product.price),
        category: product.category,
        brand: product.brand,
        desc: product.desc,
        createAt: Timestamp.now().toDate(),
      });
      // sau khi product đưa lên server thì loading = false
      setIsLoading(false);
      // sau khi gửi dữ liệu lên server thì đặt lại quá trình tải ảnh lên = 0
      setUploadProgress(0);
      // sau khi submit xong thì ta lại set input product bằng rỗng để cho lần nhập tiếp
      setProduct({ ...initialState });

      toast.success('thêm sản phẩm thành công');

      navigate('/admin/all-products');
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  const editProduct = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // productEdit thực chất chỉ là chỗ chứa dữ liệu cũ
    // ảnh productEdit.imageURL là ảnh được get từ dữ liệu cũ, sau khi thay đổi ảnh mới thì nó sẽ lọt vào initialState(là dữ liệu mới)
    // thì ta sẽ xóa ảnh từ productEdit
    if (product.imageURL !== productEdit.imageURL) {
      const storageRef = ref(storage, productEdit.imageURL);
      deleteObject(storageRef);
    }
    try {
      setDoc(doc(db, 'products cua admin trung hieu', id), {
        name: product.name,
        imageURL: product.imageURL,
        price: Number(product.price),
        category: product.category,
        brand: product.brand,
        desc: product.desc,
        // thay createAt: productEdit.createAt: productEdit ở đây vẫn là dữ liệu thời gian cũ, để cho ta biết ngày add vào tải lên là ngày nào
        createAt: productEdit.createAt,
        //editAt thời gian đã chỉnh sửa
        editedAt: Timestamp.now().toDate(),
      });
      setIsLoading(false);
      toast.success('Đã sửa thành công!');
      navigate('/admin/all-products');
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className={cx('product')}>
        <h2>{detectForm(id, 'Add new Product', 'Edit Product')}</h2>
        {/* card ở đây đc scss là box-shadow */}
        {/* cardClass sẽ đc css bên này và trả về bên <Card/> */}
        <Card cardClass={cx('card')}>
          <form onSubmit={detectForm(id, addProduct, editProduct)}>
            <label>Product Name:</label>
            <input
              type="text"
              placeholder="Product name"
              required
              name="name"
              value={product.name}
              onChange={(e) => handleInputChange(e)}
            />
            <label>Product Image:</label>
            <Card cardClass={cx('group')}>
              {uploadProgress === 0 ? null : (
                <div className={cx('progress')}>
                  <div className={cx('progress-bar')} style={{ width: `${uploadProgress}%` }}>
                    {uploadProgress < 100 ? `Uploading${uploadProgress}` : `Upload Compelete ${uploadProgress}`}
                  </div>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                placeholder="Product Image"
                name="image"
                onChange={(e) => handleImageChange(e)}
              />
              {product.imageURL === '' ? null : (
                <input type="text" placeholder="Image URL" required name="imageURL" disabled value={product.imageURL} />
              )}
            </Card>
            <label>Product Price:</label>
            <input
              type="number"
              placeholder="Product price"
              required
              min={0}
              name="price"
              value={product.price}
              onChange={(e) => handleInputChange(e)}
            />

            <label>Product Category:</label>
            <select required name="category" value={product.category} onChange={(e) => handleInputChange(e)}>
              <option value="" disabled>
                --Choose product category--
              </option>
              {categories.map((cat) => {
                return (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                );
              })}
            </select>

            <label>Product Company/Brand:</label>
            <input
              type="text"
              placeholder="Product brand"
              required
              name="brand"
              value={product.brand}
              onChange={(e) => handleInputChange(e)}
            />
            <label>Product description:</label>
            <textarea
              name="desc"
              required
              value={product.desc}
              cols="30"
              rows="10"
              onChange={(e) => handleInputChange(e)}
            ></textarea>
            {/* truyền 3 đối số */}
            <button className={cx('--btn --btn-primary')}>{detectForm(id, 'Save Product', 'Edit Product')}</button>
          </form>
        </Card>
      </div>
    </>
  );
}

export default AddProducts;
