import { useState, useEffect } from "react";

const API_URL = "https://data.moa.gov.tw/Service/OpenData/TransService.aspx?UnitId=QcbUEzN6E6DL";

export function useFetchAnimals() {
  const [animals, setAnimals] = useState(() => {
    // 先從 localStorage 取資料
    const cache = localStorage.getItem("animals");
    return cache ? JSON.parse(cache) : [];
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        setAnimals(data);
        localStorage.setItem("animals", JSON.stringify(data)); // 新增這行
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnimals();
  }, []);

  return { animals, loading, error };
}