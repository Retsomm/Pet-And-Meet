import { https } from "firebase-functions";
import fetch from "node-fetch";
import cors from "cors";

// 初始化 cors middleware
const corsHandler = cors({ origin: true }); // 允許所有來源

const API_URL = "https://data.moa.gov.tw/Service/OpenData/TransService.aspx?UnitId=QcbUEzN6E6DL";
let cachedData = null;
let cachedTime = 0;
const CACHE_DURATION = 1000 * 60 * 60 * 6;

export const api = https.onRequest((req, res) => {
  // 使用 cors middleware 包住邏輯
  corsHandler(req, res, async () => {
    try {
      if (req.method === 'OPTIONS') {
        return res.status(204).send('');
      }

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

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        try {
          const response = await fetch(API_URL, { signal: controller.signal });
          clearTimeout(timeout);

          if (!response.ok) throw new Error("Failed to fetch animal data");

          const data = await response.json();
          const filteredData = data.filter(item => !!item.album_file);

          cachedData = filteredData;
          cachedTime = now;

          res.set("Cache-Control", "public, max-age=3600");
          return res.json(filteredData);
        } catch (fetchErr) {
          clearTimeout(timeout);
          console.error('Fetch failed:', fetchErr);
          if (cachedData) {
            return res.json(cachedData);
          }
          throw fetchErr;
        }
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
});