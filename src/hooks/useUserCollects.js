//取得所有收藏（陣列）
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { ref, onValue } from "firebase/database";
import { db } from "../../firebase";

export function useUserCollects() {
  const [collects, setCollects] = useState([]);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const collectsRef = ref(db, `users/${user.uid}/collects`);
    const unsubscribe = onValue(collectsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCollects(Object.values(data));
      } else {
        setCollects([]);
      }
    });

    return () => unsubscribe();
  }, []);

  return collects;
}
