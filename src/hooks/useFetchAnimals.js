import { useState, useEffect } from "react";
import { openDB } from "idb";

const API_URL = "https://us-central1-animal-adoption-vite-app.cloudfunctions.net/api/animals";
const DB_NAME = "animal-cache";
const STORE_NAME = "animals";
const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 小時

async function getCache() {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE_NAME);
    },
  });
  const cache = await db.get(STORE_NAME, "data");
  const expire = await db.get(STORE_NAME, "expire");
  return { cache, expire };
}

async function setCache(data, expire) {
  const db = await openDB(DB_NAME, 1);
  await db.put(STORE_NAME, data, "data");
  await db.put(STORE_NAME, expire, "expire");
}

export function useFetchAnimals() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchAnimals = async () => {
      try {
        // 檢查 IndexedDB 是否有快取且未過期
        const { cache, expire } = await getCache();
        const now = Date.now();

        if (cache && expire && now < Number(expire)) {
          setAnimals(cache);
          setLoading(false);
          return;
        }

        // 拉資料
        const response = await fetch(API_URL, { signal: controller.signal });
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

        const data = await response.json();

        // 儲存快取 + 過期時間
        await setCache(data, String(now + CACHE_DURATION));
        setAnimals(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err);
          console.error("Fetch error:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAnimals();

    return () => {
      controller.abort();
    };
  }, []);

  return { animals, loading, error };
}