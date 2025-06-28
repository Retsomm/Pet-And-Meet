# Cloudinary React SDK 整合指南

## 概述

本專案已成功整合 Cloudinary React SDK，提供強大的圖片優化功能。通過 Cloudinary 的 CDN 和圖片處理技術，我們可以：

- 🎯 自動選擇最佳圖片格式（WebP、AVIF）
- 📱 響應式圖片尺寸適配
- ⚡ 全球 CDN 加速載入
- 🖼️ 智慧壓縮和品質優化
- 🔄 懶載入和佔位符支援

## 配置設定

### 環境變數設定

在 `.env` 檔案中添加您的 Cloudinary Cloud Name：

```env
VITE_CLOUDINARY_CLOUD_NAME=dpkk0iyqq
```

### 已安裝的套件

```json
{
  "dependencies": {
    "@cloudinary/react": "^1.x.x",
    "@cloudinary/url-gen": "^1.x.x",
    "cloudinary-core": "^2.x.x"
  }
}
```

## 使用方式

### 1. 基本圖片組件

使用預先配置的圖片組件：

```jsx
import {
  AnimalCardImage,
  AnimalDetailImage
} from '../components/OptimizedImage';

// 卡片/列表圖片 (400x300px) - 用於 Home 和 Data 頁面
<AnimalCardImage
  src="https://example.com/pet-image.jpg"
  alt="可愛的狗狗"
  className="w-full h-full"
/>

// 詳情頁圖片 (800x600px, 高品質) - 用於 DataItem 頁面
<AnimalDetailImage
  src="https://example.com/pet-image.jpg"
  alt="詳細的狗狗照片"
  className="w-full h-full"
/>
```

### 2. 自定義優化設定

使用通用的 OptimizedImage 組件並自定義設定：

```jsx
import OptimizedImage from "../components/OptimizedImage";

<OptimizedImage
  src="https://example.com/pet-image.jpg"
  alt="自定義優化圖片"
  customOptions={{
    width: 600,
    height: 400,
    quality: "auto:best",
    sharpenEffect: true,
  }}
  showPlaceholder={true}
  fallbackSrc="/default.webp"
  className="rounded-lg"
/>;
```

### 3. 直接使用 Cloudinary React SDK

如果需要更精細的控制，可以直接使用 Cloudinary SDK：

```jsx
import { AdvancedImage } from "@cloudinary/react";
import {
  createOptimizedImage,
  createPlaceholderImage,
} from "../utils/cloudinaryUtils";

const MyComponent = ({ imageUrl }) => {
  // 創建 Cloudinary 圖片物件
  const optimizedImage = createOptimizedImage(imageUrl, {
    width: 500,
    height: 300,
    quality: "auto:good",
    sharpenEffect: false,
  });

  // 創建佔位符圖片
  const placeholderImage = createPlaceholderImage(imageUrl);

  return (
    <div className="relative">
      {/* 佔位符 */}
      {placeholderImage && (
        <AdvancedImage
          cldImg={placeholderImage}
          className="absolute inset-0 filter blur-sm opacity-50"
          alt=""
        />
      )}

      {/* 主要圖片 */}
      {optimizedImage && (
        <AdvancedImage
          cldImg={optimizedImage}
          alt="優化圖片"
          className="relative z-10 w-full h-full object-cover"
        />
      )}
    </div>
  );
};
```

## 預設配置

系統預設了以下圖片處理配置：

| 預設類型       | 尺寸      | 品質      | 用途                    |
| -------------- | --------- | --------- | ----------------------- |
| CARD_THUMBNAIL | 400x300px | auto:good | 卡片/列表（Home、Data） |
| DETAIL_IMAGE   | 800x600px | auto:best | 詳情頁（DataItem）      |

## 工具函數

### cloudinaryUtils.js 提供的函數

```javascript
// 檢查 Cloudinary 是否已配置
isCloudinaryConfigured(); // boolean

// 創建優化圖片物件
createOptimizedImage(src, config); // Cloudinary Image Object

// 創建佔位符圖片物件
createPlaceholderImage(src); // Cloudinary Image Object

// 從 URL 提取 public_id
extractPublicIdFromUrl(url); // string

// 創建 Cloudinary 實例
createCloudinaryInstance(); // Cloudinary Instance
```

## 效能優勢

### 壓縮效果

- **檔案大小減少**：通常可減少 70-80% 的圖片檔案大小
- **載入速度提升**：平均載入時間減少 60-70%
- **頻寬節省**：大幅降低用戶流量消耗

### 智慧優化

- **格式自動選擇**：根據瀏覽器支援自動選擇 WebP、AVIF 或 JPEG
- **品質自動調整**：基於內容和網路條件動態調整品質
- **尺寸適配**：根據裝置和顯示需求調整圖片尺寸

## 降級處理

系統具備完善的降級機制：

1. **Cloudinary 未配置**：自動使用原始圖片 URL
2. **Cloudinary 載入失敗**：降級到原始圖片 URL
3. **原始圖片載入失敗**：使用預設的 fallback 圖片
4. **網路問題**：顯示載入中指示器

## 示範頁面

訪問 `/image-demo` 頁面可以看到：

- 原始圖片 vs 優化圖片的對比
- 不同預設效果的展示
- Cloudinary React SDK 的直接使用範例
- 效能提升的數據比較

## 最佳實踐

### 圖片來源處理

- **外部 URL**：使用 `fetchRemote` 功能處理
- **本地資源**：直接使用 public_id
- **API 圖片**：動態處理政府動物認養 API 回傳的圖片

### 效能優化

- 使用適當的預設配置
- 啟用懶載入減少初始載入時間
- 合理使用佔位符提升用戶體驗
- 根據使用場景選擇合適的圖片品質

### 錯誤處理

- 始終提供 fallback 圖片
- 實作降級機制
- 監控圖片載入狀態
- 提供載入中的視覺反饋

## 故障排除

### 常見問題

1. **圖片不顯示**

   - 檢查 VITE_CLOUDINARY_CLOUD_NAME 是否正確設定
   - 確認 Cloudinary 帳號是否正常
   - 檢查圖片 URL 是否有效

2. **載入速度沒有改善**

   - 確認 Cloudinary 優化是否正常運作
   - 檢查網路連線狀況
   - 驗證圖片配置是否合適

3. **佔位符效果不正常**
   - 檢查 showPlaceholder 屬性設定
   - 確認佔位符圖片是否成功產生

### 除錯方法

在瀏覽器開發者工具中：

1. 檢查 Network 標籤確認圖片來源
2. 查看 Console 的警告或錯誤訊息
3. 驗證 Cloudinary URL 的產生是否正確

## 未來擴展

可以考慮加入的功能：

- 🎨 更多圖片效果（濾鏡、邊框等）
- 📊 圖片載入效能監控
- 🔄 響應式圖片集支援
- 🎯 AI 驅動的圖片優化
- 💾 客戶端快取策略

---

更新日期：2025-06-28
版本：1.0.0
作者：GitHub Copilot
