import { useState, useEffect } from "react";

// 修正：需要加上 /animals 路徑
const API_URL = "https://us-central1-animal-adoption-vite-app.cloudfunctions.net/api/animals";
const CACHE_KEY = "animals";
const CACHE_EXPIRE_KEY = "animals_expire";
const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 小時

export function useFetchAnimals() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchAnimals = async () => {
      try {
        // 檢查 localStorage 是否有快取且未過期
        const cache = localStorage.getItem(CACHE_KEY);
        const expire = localStorage.getItem(CACHE_EXPIRE_KEY);
        const now = Date.now();

        if (cache && expire && now < Number(expire)) {
          setAnimals(JSON.parse(cache));
          setLoading(false);
          return;
        }

        // 拉資料
        const response = await fetch(API_URL, { signal: controller.signal });
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

        const data = await response.json();

        // 儲存快取 + 過期時間
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        localStorage.setItem(CACHE_EXPIRE_KEY, String(now + CACHE_DURATION));
        setAnimals(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err);
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