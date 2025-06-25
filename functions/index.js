import { https } from "firebase-functions";
import fetch from "node-fetch";

// 外部動物資料 API 來源
const API_URL = "https://data.moa.gov.tw/Service/OpenData/TransService.aspx?UnitId=QcbUEzN6E6DL";

// 快取資料內容（記憶體快取）
let cachedData = null;      // 上次取得的資料
let cachedTime = 0;         // 上次快取的時間戳
const CACHE_DURATION = 1000 * 60 * 60 * 6; // 快取有效時間：6小時

/**
 * 設定 CORS 標頭，允許跨來源請求
 * @param {object} res - 回應物件
 */
function setCorsHeaders(res) {
  res.set('Access-Control-Allow-Origin', '*'); // 允許所有來源
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // 允許的方法
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // 允許的標頭
}

/**
 * Firebase HTTPS Cloud Function：動物領養 API 入口
 */
export const api = https.onRequest(async (req, res) => {
  setCorsHeaders(res); // 設定 CORS

  // 處理預檢請求（CORS preflight）
  if (req.method === 'OPTIONS') {
    setCorsHeaders(res);
    res.status(204).send('');
    return;
  }

  try {
    // 根目錄說明文件
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

    // 取得所有動物資料
    if (req.path === "/animals") {
      const now = Date.now();

      // 若快取資料存在且未過期，直接回傳快取
      if (cachedData && now - cachedTime < CACHE_DURATION) {
        return res.json(cachedData);
      }

      // 向外部 API 取得最新資料，設定 10 秒 timeout
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000); // 10 秒
      try {
        const response = await fetch(API_URL, { signal: controller.signal });
        clearTimeout(timeout);
        if (!response.ok) throw new Error("Failed to fetch animal data");
        const data = await response.json();
        console.log('Fetched data:', Array.isArray(data), data.length);

        // 過濾掉沒有圖片的動物資料
        const filteredData = data
          .filter(item => !!item.album_file)
          .map(item => item);

        // 更新快取
        cachedData = filteredData;
        cachedTime = now;

        // 設定快取控制標頭（瀏覽器端快取 1 小時）
        res.set("Cache-Control", "public, max-age=3600");
        return res.json(filteredData);
      } catch (fetchErr) {
        clearTimeout(timeout);
        console.error('Fetch failed:', fetchErr);
        // 若有舊快取資料，回傳快取資料
        if (cachedData) {
          return res.json(cachedData);
        }
        // 沒有快取才回 500
        throw fetchErr;
      }
    } else {
      // 其他路徑回傳 404
      return res.status(404).json({ error: "Not found" });
    }
  } catch (err) {
    // 例外處理，回傳 500 錯誤
    console.error('API Error:', err);
    return res.status(500).json({
      error: "Internal server error",
      message: err.message
    });
  }
});