/**
 * Cloudinary 圖片處理工具函數
 * 用於將普通圖片 URL 轉換為 Cloudinary 壓縮優化後的 URL
 * 以及支援 Cloudinary React SDK 的輔助函數
 */

import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { format, quality } from '@cloudinary/url-gen/actions/delivery';
import { sharpen } from '@cloudinary/url-gen/actions/adjust';
import { blur } from '@cloudinary/url-gen/actions/effect';

/**
 * 創建 Cloudinary 實例
 * @returns {Cloudinary|null} Cloudinary 實例或 null（如果未配置）
 */
export function createCloudinaryInstance() {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) {
    console.warn('Cloudinary Cloud Name not configured in environment variables');
    return null;
  }
  
  return new Cloudinary({
    cloud: {
      cloudName: cloudName,
    },
    url: {
      secure: true,
    },
  });
}

/**
 * 檢查 Cloudinary 是否已正確配置
 * @returns {boolean} 是否已配置
 */
export function isCloudinaryConfigured() {
  return Boolean(import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
}

/**
 * 從 URL 提取檔案名稱作為 public_id
 * @param {string} url - 圖片 URL
 * @returns {string} 提取的 public_id
 */
export function extractPublicIdFromUrl(url) {
  if (!url) return 'placeholder';
  
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const filename = pathname.split('/').pop();
    // 移除副檔名
    const publicId = filename.replace(/\.[^/.]+$/, '');
    return publicId || 'placeholder';
  } catch {
    console.warn('Failed to extract public_id from URL:', url);
    return 'placeholder';
  }
}

// Cache to avoid repeated logging for the same URLs
const urlSuitabilityCache = new Map();
const MAX_CACHE_SIZE = 100;

// Clean cache when it gets too large
function cleanCache(cache) {
  if (cache.size > MAX_CACHE_SIZE) {
    // Remove oldest entries (first 20 entries)
    const keysToDelete = Array.from(cache.keys()).slice(0, 20);
    keysToDelete.forEach(key => cache.delete(key));
  }
}

/**
 * 檢查 URL 是否適合 Cloudinary 處理
 * @param {string} url - 圖片 URL
 * @returns {boolean} 是否適合處理
 */
function isUrlSuitableForCloudinary(url) {
  if (!url) return false;
  
  // Check cache first to avoid repeated processing and logging
  if (urlSuitabilityCache.has(url)) {
    return urlSuitabilityCache.get(url);
  }
  
  let isSuitable = true;
  
  // 檢查是否已經是 Cloudinary URL
  if (url.includes('cloudinary.com')) {
    if (import.meta.env.DEV && import.meta.env.VITE_CLOUDINARY_DEBUG === 'true') {
      console.debug('Skipping Cloudinary URL:', url);
    }
    isSuitable = false;
  }
  // 檢查是否為政府網站 URL（可能有特殊字符或限制）
  else if (url.includes('pet.gov.tw')) {
    // Only log once per URL to reduce console noise
    if (import.meta.env.DEV && import.meta.env.VITE_CLOUDINARY_DEBUG === 'true') {
      console.debug('Government website images may have special characters or access restrictions, using original URL:', url);
    }
    isSuitable = false;
  }
  
  // Cache the result
  urlSuitabilityCache.set(url, isSuitable);
  
  // Clean cache if it gets too large
  cleanCache(urlSuitabilityCache);
  
  return isSuitable;
}

/**
 * 使用 Cloudinary React SDK 創建圖片物件
 * @param {string} src - 圖片來源 URL
 * @param {Object} config - 圖片配置
 * @returns {Object|null} Cloudinary 圖片物件或 null
 */
export function createOptimizedImage(src, config = {}) {
  const cld = createCloudinaryInstance();
  if (!cld || !src) return null;

  const {
    width = 400,
    height = 300,
    quality: qualityValue = 'auto:good',
    sharpenEffect = false
  } = config;

  try {
    // 檢查 URL 是否適合 Cloudinary 處理
    if (!isUrlSuitableForCloudinary(src)) {
      if (import.meta.env.DEV && import.meta.env.VITE_CLOUDINARY_DEBUG === 'true') {
        console.debug('URL not suitable for Cloudinary processing, using original URL:', src);
      }
      return null;
    }
    
    // 對於外部 URL，我們使用 Cloudinary 的 fetch 功能通過 URL 構建
    if (src.startsWith('http://') || src.startsWith('https://')) {
      // 使用 fetch URL 的方式，這是更穩定的方法
      const cloudinaryUrl = `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/fetch/w_${width},h_${height},c_auto,f_auto,q_${qualityValue}${sharpenEffect ? ',e_sharpen' : ''}/${encodeURIComponent(src)}`;
      
      // 返回一個包含 URL 的簡單物件，可以被 AdvancedImage 使用
      return {
        toURL: () => cloudinaryUrl,
        toString: () => cloudinaryUrl
      };
    }
    
    // 如果是本地資源或 public_id
    const publicId = extractPublicIdFromUrl(src) || 'placeholder';
    
    const image = cld.image(publicId)
      .resize(auto().width(width).height(height))
      .delivery(format('auto'))
      .delivery(quality(qualityValue));
      
    if (sharpenEffect) {
      image.adjust(sharpen());
    }
    
    return image;
  } catch (error) {
    console.warn('Failed to create optimized image:', error);
    return null;
  }
}

/**
 * 創建低品質佔位符圖片
 * @param {string} src - 圖片來源 URL
 * @returns {Object|null} Cloudinary 佔位符圖片物件或 null
 */
export function createPlaceholderImage(src) {
  const cld = createCloudinaryInstance();
  if (!cld || !src) return null;

  try {
    // 檢查 URL 是否適合 Cloudinary 處理
    if (!isUrlSuitableForCloudinary(src)) {
      if (import.meta.env.DEV && import.meta.env.VITE_CLOUDINARY_DEBUG === 'true') {
        console.debug('URL not suitable for Cloudinary placeholder processing, skipping placeholder:', src);
      }
      return null;
    }
    
    // 對於外部 URL，使用 Cloudinary 的 fetch 功能通過 URL 構建
    if (src.startsWith('http://') || src.startsWith('https://')) {
      const cloudinaryUrl = `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/fetch/w_50,h_38,c_auto,f_auto,q_auto:low,e_blur:5/${encodeURIComponent(src)}`;
      
      // 返回一個包含 URL 的簡單物件，可以被 AdvancedImage 使用
      return {
        toURL: () => cloudinaryUrl,
        toString: () => cloudinaryUrl
      };
    }
    
    // 本地資源
    const publicId = extractPublicIdFromUrl(src) || 'placeholder';
    return cld.image(publicId)
      .resize(auto().width(50).height(38))
      .delivery(format('auto'))
      .delivery(quality('auto:low'))
      .effect(blur().strength(5));
  } catch (error) {
    console.warn('Failed to create placeholder image:', error);
    return null;
  }
}

/**
 * Cloudinary 圖片處理工具函數
 * 用於將普通圖片 URL 轉換為 Cloudinary 壓縮優化後的 URL
 */

/**
 * 使用 Cloudinary 的 fetch 功能來壓縮和優化圖片
 * @param {string} imageUrl - 原始圖片 URL
 * @param {Object} options - 圖片處理選項
 * @param {number} options.width - 圖片寬度（像素）
 * @param {number} options.height - 圖片高度（像素）
 * @param {string} options.quality - 圖片品質 ('auto', 'auto:best', 'auto:good', 'auto:eco', 'auto:low' 或 1-100 的數字)
 * @param {string} options.format - 圖片格式 ('auto', 'webp', 'avif', 'jpg', 'png' 等)
 * @param {string} options.crop - 裁剪模式 ('fill', 'fit', 'crop', 'scale' 等)
 * @returns {string} 壓縮優化後的 Cloudinary URL 或原始 URL（如果優化失敗）
 */
export function getOptimizedImageUrl(imageUrl, options = {}) {
  // 如果沒有提供圖片 URL，返回預設圖片
  if (!imageUrl) {
    return "/default.webp";
  }

  // 檢查是否已經是 Cloudinary URL，如果是就直接返回
  if (imageUrl.includes('cloudinary.com')) {
    return imageUrl;
  }

  // 檢查是否是相對路徑或本地檔案，如果是就直接返回
  if (imageUrl.startsWith('/') || imageUrl.startsWith('./') || !imageUrl.includes('http')) {
    return imageUrl;
  }

  // 檢查 URL 是否適合 Cloudinary 處理
  if (!isUrlSuitableForCloudinary(imageUrl)) {
    console.warn('URL not suitable for Cloudinary processing, using original URL:', imageUrl);
    return imageUrl;
  }

  // Cloudinary 設定
  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  
  // 如果沒有設定 Cloud Name 或使用 demo，直接返回原始 URL
  if (!CLOUD_NAME || CLOUD_NAME === 'demo') {
    console.warn('Cloudinary Cloud Name not configured or using demo account. Falling back to original URL.');
    return imageUrl;
  }
  
  // 預設選項
  const defaultOptions = {
    width: 400,
    height: 400,
    quality: 'auto:good',
    format: 'auto',
    crop: 'fill',
    fetch_format: 'auto',
    flags: 'progressive'
  };

  // 合併選項
  const finalOptions = { ...defaultOptions, ...options };

  // 建構 Cloudinary 轉換參數
  const transformations = [];

  // 添加尺寸參數
  if (finalOptions.width || finalOptions.height) {
    const sizeParams = [];
    if (finalOptions.width) sizeParams.push(`w_${finalOptions.width}`);
    if (finalOptions.height) sizeParams.push(`h_${finalOptions.height}`);
    if (finalOptions.crop) sizeParams.push(`c_${finalOptions.crop}`);
    transformations.push(sizeParams.join(','));
  }

  // 添加品質參數
  if (finalOptions.quality) {
    transformations.push(`q_${finalOptions.quality}`);
  }

  // 添加格式參數
  if (finalOptions.format && finalOptions.format !== 'auto') {
    transformations.push(`f_${finalOptions.format}`);
  } else {
    transformations.push('f_auto');
  }

  // 添加其他優化參數
  if (finalOptions.flags) {
    transformations.push(`fl_${finalOptions.flags}`);
  }

  // 建構完整的 Cloudinary URL
  const transformationString = transformations.join(',');
  const encodedUrl = encodeURIComponent(imageUrl);
  
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/fetch/${transformationString}/${encodedUrl}`;
}

/**
 * 簡單的圖片優化替代方案
 * 當 Cloudinary 不可用時，使用這個函數提供基本的圖片優化
 * @param {string} imageUrl - 原始圖片 URL
 * @param {Object} options - 優化選項
 * @returns {string} 優化後的圖片 URL 或原始 URL
 */
export function getSimpleOptimizedImageUrl(imageUrl, options = {}) {
  if (!imageUrl) return "/default.webp";
  
  // 如果是本地檔案，直接返回
  if (imageUrl.startsWith('/') || imageUrl.startsWith('./') || !imageUrl.includes('http')) {
    return imageUrl;
  }
  
  // 簡單的 URL 參數優化（某些圖片服務支援）
  const url = new URL(imageUrl);
  
  // 嘗試添加常見的優化參數
  if (options.width) {
    url.searchParams.set('w', options.width);
  }
  if (options.height) {
    url.searchParams.set('h', options.height);
  }
  if (options.quality && typeof options.quality === 'number') {
    url.searchParams.set('q', options.quality);
  }
  
  return url.toString();
}

/**
 * 為不同用途預設的圖片優化選項（簡化版）
 */
export const IMAGE_PRESETS = {
  // 卡片/列表通用 - 適合 Home 頁面和 Data 頁面
  CARD_THUMBNAIL: {
    width: 400,
    height: 300,
    quality: 'auto:good',
    format: 'auto',
    crop: 'fill'
  },
  
  // 詳情頁圖片 - 適合 DataItem 頁面
  DETAIL_IMAGE: {
    width: 800,
    height: 600,
    quality: 'auto:best',
    format: 'auto',
    crop: 'fit'
  },
};

/**
 * 根據預設名稱獲取優化的圖片 URL
 * @param {string} imageUrl - 原始圖片 URL
 * @param {string} presetName - 預設名稱（來自 IMAGE_PRESETS）
 * @returns {string} 優化後的圖片 URL
 */
export function getImageWithPreset(imageUrl, presetName) {
  const preset = IMAGE_PRESETS[presetName];
  if (!preset) {
    console.warn(`Unknown image preset: ${presetName}`);
    return getOptimizedImageUrl(imageUrl);
  }
  
  return getOptimizedImageUrl(imageUrl, preset);
}

/**
 * 生成多個不同尺寸的圖片 URL（用於響應式圖片）
 * @param {string} imageUrl - 原始圖片 URL
 * @param {Array} sizes - 尺寸陣列，例如 [300, 600, 900]
 * @returns {Object} 包含不同尺寸 URL 的物件
 */
export function generateResponsiveImages(imageUrl, sizes = [300, 600, 900]) {
  const images = {};
  
  sizes.forEach(size => {
    images[`${size}w`] = getOptimizedImageUrl(imageUrl, {
      width: size,
      quality: 'auto:good',
      format: 'auto',
      crop: 'fit'
    });
  });
  
  return images;
}

/**
 * 為懶加載生成低品質佔位符圖片
 * @param {string} imageUrl - 原始圖片 URL
 * @returns {string} 低品質佔位符圖片 URL
 */
export function getPlaceholderImage(imageUrl) {
  return getOptimizedImageUrl(imageUrl, {
    width: 50,
    height: 50,
    quality: 'auto:low',
    format: 'auto',
    crop: 'fill',
    flags: 'progressive'
  });
}

// 更新主要的優化函數以包含降級功能
const originalGetOptimizedImageUrl = getOptimizedImageUrl;

export { originalGetOptimizedImageUrl as getCloudinaryOptimizedImageUrl };
