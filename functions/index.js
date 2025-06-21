import { https } from "firebase-functions";
import fetch from "node-fetch";
import sharp from "sharp";

const API_URL = "https://data.moa.gov.tw/Service/OpenData/TransService.aspx?UnitId=QcbUEzN6E6DL";

// 快取資料
let cachedData = null;
let cachedTime = 0;
const CACHE_DURATION = 1000 * 60 * 60 * 6; // 6小時快取

// WebP 轉換函式
async function convertToWebP(imageUrl) {
  try {
    if (!imageUrl) return null;
    
    const imageResponse = await fetch(imageUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AnimalAdoptionBot/1.0)'
      }
    });
    
    if (!imageResponse.ok) return imageUrl;
    
    const imageBuffer = await imageResponse.buffer();
    const webpBuffer = await sharp(imageBuffer)
      .webp({ 
        quality: 80,
        effort: 4
      })
      .toBuffer();
    
    return `data:image/webp;base64,${webpBuffer.toString('base64')}`;
    
  } catch (error) {
    return imageUrl;
  }
}

export const api = https.onRequest(async (req, res) => {
  // 處理根路徑
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

    // 使用快取資料
    if (cachedData && now - cachedTime < CACHE_DURATION) {
      return res.json(cachedData);
    }

    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch animal data");
      const data = await response.json();

      const processedData = await Promise.all(
        data.map(async (item) => {
          const webpImage = await convertToWebP(item.album_file);
          
          return {
            id: item.animal_id,
            kind: item.animal_kind,
            place: item.animal_place,
            sex: item.animal_sex,
            bodytype: item.animal_bodytype,
            colour: item.animal_colour,
            album_file: webpImage,
            shelter_name: item.shelter_name
          };
        })
      );

      cachedData = processedData;
      cachedTime = now;
      res.set("Cache-Control", "public, max-age=3600");
      res.json(processedData);
      
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(404).json({ error: "Not found" });
  }
});