// 取得單一動物的收藏狀態與切換功能
import { useEffect, useState, useCallback } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../../firebase";
import { ref, onValue, query, orderByChild, equalTo, get, remove, push, set } from "firebase/database";

export function useFavorite(animal) {
  const [isCollected, setIsCollected] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // 監聽收藏狀態變化
  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribeAuth();
  }, []);


  useEffect(() => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user || !animal?.animal_id) {
    setIsCollected(false); // <--- 加這行，確保未登入時 isCollected 為 false
    return;
  }
  const collectsRef = ref(db, `users/${user.uid}/collects`);
  const unsubscribe = onValue(collectsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      setIsCollected(Object.values(data).some(item => item.animal_id === animal.animal_id));
    } else {
      setIsCollected(false);
    }
  });
  return () => unsubscribe();
}, [animal?.animal_id]);
  // 切換收藏狀態
  const toggleFavorite = useCallback(async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return false;
    
  const collectsRef = ref(db, `users/${user.uid}/collects`);
    //
  if (!isCollected) {
    // 先取得現有收藏，檢查是否已存在
    const snapshot = await get(collectsRef);
    const collects = snapshot.val() || {};
    // 檢查是否已存在該動物
    const exists = Object.values(collects).some(
      (item) => item.animal_id === animal.animal_id
    );
    if (exists) return; // 已存在就不再加入
    // 如果不存在，則新增收藏
    const newCollectRef = push(collectsRef);
    await set(newCollectRef, animal);
  } else {
    // 如果已收藏，則從收藏中移除
    const q = query(collectsRef, orderByChild("animal_id"), equalTo(animal.animal_id));
    const snapshot = await get(q);
    if (snapshot.exists()) {
      snapshot.forEach(child => {
        remove(ref(db, `users/${user.uid}/collects/${child.key}`));
      });
    }
  }
}, [animal, isCollected]);

  return { isCollected, toggleFavorite, isLoggedIn };
}
