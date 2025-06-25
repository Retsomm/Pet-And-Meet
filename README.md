# 🐾 動物收養平台

一個現代化的動物收養平台，讓使用者能夠瀏覽、收藏和了解待收養的動物資訊。使用 React + Vite 構建，具備響應式設計和離線功能。

## ✨ 主要功能

- 🏠 **首頁展示**：每日推薦動物與領養流程介紹
- 🔍 **動物瀏覽**：完整的動物資料庫，支援篩選和搜尋
- ❤️ **收藏功能**：登入用戶可收藏喜愛的動物
- 👤 **用戶系統**：支援 Google 和 Facebook 登入
- 📱 **響應式設計**：適配各種設備螢幕
- 💾 **離線快取**：使用 IndexedDB 提供離線瀏覽體驗
- 🎨 **主題切換**：支援明暗主題模式

## 🛠 技術棧

### 前端框架

- **React 19** - 用戶界面庫
- **Vite 6** - 構建工具和開發服務器
- **React Router 7** - 路由管理

### UI 和樣式

- **Tailwind CSS 3** - 原子化 CSS 框架
- **DaisyUI 4** - Tailwind CSS 組件庫
- **React Intersection Observer** - 滾動監聽

### 後端服務

- **Firebase Auth** - 用戶認證
- **Firebase Realtime Database** - 即時資料庫
- **Firebase Functions** - 無服務器 API

### 數據管理

- **Zustand** - 狀態管理
- **IndexedDB (idb)** - 本地數據快取

### 開發工具

- **ESLint** - 代碼檢查
- **PostCSS** - CSS 處理
- **Autoprefixer** - CSS 自動前綴

## 📁 專案結構

```
src/
├── components/          # React 組件
│   ├── AnimalCard.jsx   # 動物卡片組件
│   ├── AnimalFilterMenu.jsx # 篩選選單
│   ├── AnimalSkeleton.jsx   # 載入骨架屏
│   ├── Dock.jsx         # 底部導航欄
│   ├── Layout.jsx       # 布局組件
│   ├── Navbar.jsx       # 頂部導航欄
│   ├── ProtectedRoute.jsx # 路由保護
│   └── ThemeToggle.jsx  # 主題切換
├── hooks/               # 自定義 Hooks
│   ├── useFavorite.js   # 收藏功能
│   ├── useFetchAnimals.js # 動物資料獲取
│   ├── useSyncFavoritesWithAPI.js # 收藏同步
│   └── useUserCollects.js # 用戶收藏管理
├── pages/               # 頁面組件
│   ├── Collect.jsx      # 收藏頁面
│   ├── Data.jsx         # 動物列表頁面
│   ├── DataItem.jsx     # 動物詳情頁面
│   ├── Home.jsx         # 首頁
│   ├── Login.jsx        # 登入頁面
│   └── Profile.jsx      # 個人資料頁面
├── stores/              # Zustand 狀態管理
│   ├── useAuthStore.js  # 認證狀態
│   └── useThemeStore.js # 主題狀態
└── utils/               # 工具函數
    └── filterAnimals.js # 動物篩選邏輯
```

## 🚀 快速開始

### 環境要求

- Node.js 18+
- npm 或 yarn

### 安裝依賴

```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install
```

### 環境變數設置

在專案根目錄創建 `.env` 檔案：

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 運行開發服務器

```bash
# 啟動開發服務器
npm run dev

# 或
yarn dev
```

應用程式將在 `http://localhost:5173` 啟動。

### 建置生產版本

```bash
# 建置生產版本
npm run build

# 預覽建置結果
npm run preview
```

### 代碼檢查

```bash
# 運行 ESLint
npm run lint
```

## 🔧 主要功能說明

### 動物資料快取

應用程式使用 IndexedDB 實現本地快取，提供：

- 24 小時快取有效期
- 離線瀏覽功能
- 自動快取更新

### 用戶認證

支援多種登入方式：

- Google 帳號登入
- Facebook 帳號登入
- 自動登入狀態保持

### 收藏系統

登入用戶可以：

- 收藏喜愛的動物
- 在收藏頁面管理收藏列表
- 資料與 Firebase 同步

### 響應式設計

- 支援手機、平板、桌面設備
- 適應性布局
- 觸控友好的操作界面

## 🎨 主題系統

應用程式支援明暗主題切換：

- 自動檢測系統主題偏好
- 手動切換主題
- 主題設置持久化保存

## 🔄 API 整合

後端 API 託管在 Firebase Functions：

- 動物資料 API
- 用戶收藏同步
- 即時資料更新

## 📱 頁面功能

- **首頁**：每日推薦動物、領養流程介紹
- **動物列表**：完整動物資料庫，支援篩選
- **動物詳情**：詳細動物資訊和收藏功能
- **收藏頁面**：管理用戶收藏的動物
- **登入頁面**：用戶認證入口
- **個人資料**：用戶資訊管理

## 🤝 貢獻指南

1. Fork 此專案
2. 創建功能分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'Add some amazing feature'`
4. 推送到分支：`git push origin feature/amazing-feature`
5. 開啟 Pull Request

## 📄 授權

此專案採用 MIT 授權 - 查看 [LICENSE](LICENSE) 檔案了解詳情。

## 🐛 問題回報

如果發現問題，請在 [Issues](../../issues) 頁面回報。

## 🙏 致謝

- [React](https://reactjs.org/) - 用戶界面庫
- [Vite](https://vitejs.dev/) - 快速的建置工具
- [Firebase](https://firebase.google.com/) - 後端服務
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [DaisyUI](https://daisyui.com/) - UI 組件庫
