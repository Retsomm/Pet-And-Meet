import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { ref, onValue } from "firebase/database";
import { db } from "../../firebase";

export function useUserCollects() {
  const [collects, setCollects] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      setCollects([]);
      setLoading(false);
      return;
    }

    const collectsRef = ref(db, `users/${user.uid}/collects`);
    const unsubscribe = onValue(collectsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const collectsWithId = Object.values(data).map(item => ({
          ...item,
          id: item.animal_id,
        }));
        setCollects(collectsWithId);
      } else {
        setCollects([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { collects, loading };
}
