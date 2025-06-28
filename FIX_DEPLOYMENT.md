# 🚨 緊急修復：Firebase 部署問題

## 問題

- GitHub Actions 部署失敗
- `firebaseServiceAccount` Secret 未正確設置

## 解決步驟

### 1. 重新設置 Firebase 服務帳戶 Secret

1. **複製 JSON 內容**：

   - 打開檔案：`animal-adoption-vite-app-firebase-adminsdk-fbsvc-cc0342cc7b.json`
   - 按 `Ctrl+A` 選取全部內容
   - 按 `Ctrl+C` 複製

2. **前往 GitHub 設置**：

   - 前往：https://github.com/Retsomm/Pet-And-Meet/settings/secrets/actions
   - 如果已存在 `FIREBASE_SERVICE_ACCOUNT_ANIMAL_ADOPTION_VITE_APP`，請刪除它
   - 點擊 "New repository secret"

3. **設置 Secret**：
   - **Name**: `FIREBASE_SERVICE_ACCOUNT_ANIMAL_ADOPTION_VITE_APP`
   - **Value**: 貼上完整的 JSON 內容（包括開頭的 `{` 和結尾的 `}`）

### 2. 確認所有必要的 Secrets

確保以下 Secrets 都已設置：

- [x] `FIREBASE_SERVICE_ACCOUNT_ANIMAL_ADOPTION_VITE_APP`
- [ ] `FIREBASE_TOKEN`
- [ ] `VITE_FIREBASE_API_KEY`
- [ ] `VITE_FIREBASE_AUTH_DOMAIN`
- [ ] `VITE_FIREBASE_PROJECT_ID`
- [ ] `VITE_FIREBASE_STORAGE_BUCKET`
- [ ] `VITE_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `VITE_FIREBASE_APP_ID`
- [ ] `VITE_FIREBASE_MEASUREMENT_ID`
- [ ] `VITE_CLOUDINARY_CLOUD_NAME`

### 3. 取得 Firebase Token

在本地執行：

```bash
npx firebase login:ci
```

將產生的 token 設置為 `FIREBASE_TOKEN` Secret。

### 4. 取得 Firebase 配置值

從 Firebase Console → 專案設定 → 一般 → 您的應用程式中取得。

### 5. 測試部署

設置完成後，提交任何更改來觸發部署：

```bash
git add .
git commit -m "Fix Firebase deployment configuration"
git push origin main
```

## 檢查清單

- [ ] Firebase 服務帳戶 JSON 已正確複製並設置
- [ ] 所有環境變數 Secrets 已設置
- [ ] Firebase Token 已設置
- [ ] 推送代碼測試部署
- [ ] 檢查 GitHub Actions 執行結果
