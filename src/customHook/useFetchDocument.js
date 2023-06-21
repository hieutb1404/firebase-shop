import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { db } from '~/firebase/config';

// lấy dữ liệu dựa vào id
function useFetchDocument(collectionName, documentID) {
  const [document, setDocument] = useState(null);

  const getDocument = async () => {
    // lấy dữ liệu trên server theo id hiện tại
    const docRef = doc(db, collectionName, documentID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const obj = {
        id: documentID,
        ...docSnap.data(),
      };
      setDocument(obj);
    } else {
      toast.error('Document not found');
    }
  };
  useEffect(() => {
    getDocument();
  }, []);

  return { document };
}

export default useFetchDocument;
