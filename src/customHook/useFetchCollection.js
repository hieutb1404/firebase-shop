import { useEffect, useState } from 'react';

import { db, storage } from '~/firebase/config';
import { collection, doc, setDoc, query, onSnapshot, orderBy, deleteDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
// truyền tham số lấy data
// lấy dữ liệu ko cần ID
function useFetchCollection(collectionName) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getCollection = () => {
    setIsLoading(true);

    try {
      //Nhận một tài liệu
      // tham số 2 phải đúng với đúng tên mình addProduct gửi lên
      const docRef = collection(db, collectionName);
      //Đặt hàng và giới hạn dữ liệu
      // createAt, desc là biến trên data
      const q = query(docRef, orderBy('createAt', 'desc'));

      //Nghe nhiều tài liệu trong một bộ sưu tập
      // trong hàm onSnapshot ta nhận vào 2 đối số là q và 1 function...
      // sau khi truyền đối số nó sẽ tự đồng chuyển về hàm onSnapshot trên
      // còn hàm snapshot(đối số 2) là ta nhận đối số từ server về chứ k phải ta truyền đối số đi
      // phía server đã xử lý việc này
      onSnapshot(q, (snapshot) => {
        // snapshow.docs ... docs ở đây là dữ liệu sẵn trong firebase console.log(snapshot) ra là nhìn thấy
        // trong chấm.docs có cả id product
        console.log(snapshot.docs);
        const allData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(allData);
        setIsLoading(false);
      });
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };
  // cập nhật để cho setData có dữ liệu và đưa ra ngoài render
  useEffect(() => {
    getCollection();
  }, []);

  return { data, isLoading };
}

export default useFetchCollection;
