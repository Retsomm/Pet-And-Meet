import { create } from "zustand";
import { openDB } from "idb";

const DB_NAME = "auth-db";
const STORE_NAME = "auth";
const USER_KEY = "user";

// 取得 user
async function getUserFromIDB() {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE_NAME);
    },
  });
  return await db.get(STORE_NAME, USER_KEY);
}

// 設定 user
async function setUserToIDB(user) {
  const db = await openDB(DB_NAME, 1);
  await db.put(STORE_NAME, user, USER_KEY);
}

// 移除 user
async function removeUserFromIDB() {
  const db = await openDB(DB_NAME, 1);
  await db.delete(STORE_NAME, USER_KEY);
}

const useAuthStore = create((set) => ({
  isLoggedIn: false,
  user: null,
  isLoading: true, // 新增
  init: async () => {
    set({ isLoading: true });
    const user = await getUserFromIDB();
    set({ isLoggedIn: !!user, user: user || null, isLoading: false });
  },
  login: async (user) => {
    await setUserToIDB(user);
    set({ isLoggedIn: true, user });
  },
  logout: async () => {
    await removeUserFromIDB();
    set({ isLoggedIn: false, user: null });
  },
}));

export default useAuthStore;