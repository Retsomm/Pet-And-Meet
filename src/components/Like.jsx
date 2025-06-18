import { getAuth } from "firebase/auth";
import { db } from "../../firebase";
import { ref, push, set } from "firebase/database";

export async function Like(animal) {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("請先登入");
  // 取得新節點參考
  const collectsRef = ref(db, `users/${user.uid}/collects`);
  const newCollectRef = push(collectsRef);
  await set(newCollectRef, animal); // 用 set(參考, 資料)
  return newCollectRef.key;
}
