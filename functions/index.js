import { https } from "firebase-functions";
import fetch from "node-fetch";

const API_URL = "https://data.moa.gov.tw/Service/OpenData/TransService.aspx?UnitId=QcbUEzN6E6DL";

// 快取資料
let cachedData = null;
let cachedTime = 0;
const CACHE_DURATION = 1000 * 60 * 60 * 6; // 6小時快取

function setCorsHeaders(res) {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  // res.set('Access-Control-Allow-Credentials', 'true'); // 若有需要可開啟
}

export const api = https.onRequest(async (req, res) => {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') {
    // 明確回應 header
    setCorsHeaders(res);
    res.status(204).send('');
    return;
  }
  try {
    if (req.path === "/" || req.path === "") {
      return res.json({
        message: "動物領養 API",
        version: "1.0.0",
        endpoints: [
          {
            path: "/animals",
            method: "GET",
            description: "取得所有動物資料"
          }
        ]
      });
    }
    if (req.path === "/animals") {
      const now = Date.now();
      if (cachedData && now - cachedTime < CACHE_DURATION) {
        return res.json(cachedData);
      }
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch animal data");
      const data = await response.json();
      console.log('Fetched data:', Array.isArray(data), data.length);

      const filteredData = data
        .filter(item => !!item.album_file)
        .slice(0, 100);
        // .map(item => item);

      cachedData = filteredData;
      cachedTime = now;
      res.set("Cache-Control", "public, max-age=3600");
      return res.json(filteredData);
    } else {
      return res.status(404).json({ error: "Not found" });
    }
  } catch (err) {
    console.error('API Error:', err);
    return res.status(500).json({
      error: "Internal server error",
      message: err.message
    });
  }
});