import React, { useState, useMemo } from "react";
import { AdvancedImage } from "@cloudinary/react";
import {
  createOptimizedImage,
  createPlaceholderImage,
  isCloudinaryConfigured,
} from "../utils/cloudinaryUtils";

// Cache for cloudinary image objects to prevent repeated creation
const cloudinaryImageCache = new Map();
const placeholderImageCache = new Map();
const MAX_CACHE_SIZE = 50;

// Clean cache when it gets too large
function cleanCache(cache) {
  if (cache.size > MAX_CACHE_SIZE) {
    // Remove oldest entries (first 10 entries)
    const keysToDelete = Array.from(cache.keys()).slice(0, 10);
    keysToDelete.forEach((key) => cache.delete(key));
  }
}

// 預設圖片變換配置（簡化版）
const PRESET_CONFIGS = {
  CARD_THUMBNAIL: {
    width: 400,
    height: 300,
    quality: "auto:good",
    sharpenEffect: false,
  },
  DETAIL_IMAGE: {
    width: 800,
    height: 600,
    quality: "auto:best",
    sharpenEffect: true,
  },
};

/**
 * 優化的圖片組件 - 使用 Cloudinary React SDK
 * 支援 Cloudinary 自動優化、懶加載、錯誤處理和佔位符
 * @param {Object} props
 * @param {string} props.src - 原始圖片 URL
 * @param {string} props.preset - Cloudinary 預設類型
 * @param {string} props.alt - 圖片替代文字
 * @param {string} props.className - CSS 類名
 * @param {string} props.fallbackSrc - 備用圖片 URL
 * @param {boolean} props.showPlaceholder - 是否顯示低品質佔位符
 * @param {Object} props.customOptions - 自定義 Cloudinary 選項
 * @param {Object} props.rest - 其他屬性
 */
const OptimizedImage = ({
  src,
  preset = "CARD_THUMBNAIL",
  alt = "",
  className = "",
  fallbackSrc = "/default.webp",
  showPlaceholder = true,
  customOptions = null,
  ...rest
}) => {
  const [imageError, setImageError] = useState(false);
  const [useCloudinary, setUseCloudinary] = useState(true);
  const [showFallback, setShowFallback] = useState(false);

  // 檢查 Cloudinary 是否可用
  const cloudinaryAvailable = useMemo(() => {
    return isCloudinaryConfigured();
  }, []);

  // 創建 Cloudinary 圖片物件
  const cloudinaryImage = useMemo(() => {
    if (!cloudinaryAvailable || !useCloudinary || !src) return null;

    const config =
      customOptions || PRESET_CONFIGS[preset] || PRESET_CONFIGS.CARD_THUMBNAIL;

    // Create cache key from src and config
    const cacheKey = `${src}_${JSON.stringify(config)}`;

    // Check cache first
    if (cloudinaryImageCache.has(cacheKey)) {
      return cloudinaryImageCache.get(cacheKey);
    }

    const image = createOptimizedImage(src, config);

    // Cache the result
    if (image) {
      cloudinaryImageCache.set(cacheKey, image);
      cleanCache(cloudinaryImageCache);
    }

    return image;
  }, [src, preset, customOptions, cloudinaryAvailable, useCloudinary]);

  // 創建佔位符圖片
  const placeholderImage = useMemo(() => {
    if (!cloudinaryAvailable || !useCloudinary || !src || !showPlaceholder)
      return null;

    // Check cache first
    if (placeholderImageCache.has(src)) {
      return placeholderImageCache.get(src);
    }

    const placeholder = createPlaceholderImage(src);

    // Cache the result
    if (placeholder) {
      placeholderImageCache.set(src, placeholder);
      cleanCache(placeholderImageCache);
    }

    return placeholder;
  }, [src, cloudinaryAvailable, useCloudinary, showPlaceholder]);

  // 處理 Cloudinary 圖片載入錯誤
  const handleCloudinaryError = (e) => {
    console.warn(
      "Cloudinary image failed to load, falling back to original URL:",
      e?.target?.src || src
    );
    setUseCloudinary(false);
    setImageError(false);
  };

  // 處理傳統圖片載入錯誤
  const handleImageError = (e) => {
    console.warn(
      "Image failed to load, using fallback:",
      e?.target?.src || src
    );
    setShowFallback(true);
  };

  // 檢查是否為政府網站圖片，如果是則直接使用原始 URL
  const shouldUseOriginalUrl = useMemo(() => {
    if (!src) return false;
    // 政府動物認養網站的圖片通常有特殊字符或訪問限制
    return src.includes("pet.gov.tw");
  }, [src]);

  // 如果是政府網站圖片，直接使用原始 URL 而不通過 Cloudinary
  if (shouldUseOriginalUrl) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <img
          src={showFallback ? fallbackSrc : src || fallbackSrc}
          alt={alt}
          className="w-full h-full object-cover"
          onError={handleImageError}
          {...rest}
        />

        {/* 載入失敗時的指示 */}
        {showFallback && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 opacity-75">
            <span className="text-xs text-gray-500">圖片載入失敗</span>
          </div>
        )}
      </div>
    );
  }
  // 如果 Cloudinary 可用且成功創建圖片物件
  if (cloudinaryAvailable && useCloudinary && cloudinaryImage && !imageError) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        {/* Cloudinary 佔位符 */}
        {showPlaceholder &&
          placeholderImage &&
          // 檢查是否是 URL 字符串物件還是 Cloudinary Image 物件
          (typeof placeholderImage.toURL === "function" ? (
            <img
              src={placeholderImage.toURL()}
              className="absolute inset-0 w-full h-full object-cover filter blur-sm opacity-50"
              alt=""
              onError={() => {}} // 忽略佔位符錯誤
              style={{ zIndex: 1 }}
            />
          ) : (
            <AdvancedImage
              cldImg={placeholderImage}
              className="absolute inset-0 w-full h-full object-cover filter blur-sm opacity-50"
              alt=""
              onError={() => {}} // 忽略佔位符錯誤
              style={{ zIndex: 1 }}
            />
          ))}

        {/* 主要 Cloudinary 圖片 */}
        {typeof cloudinaryImage.toURL === "function" ? (
          <img
            src={cloudinaryImage.toURL()}
            alt={alt}
            className="w-full h-full object-cover relative z-10"
            onError={handleCloudinaryError}
            {...rest}
          />
        ) : (
          <AdvancedImage
            cldImg={cloudinaryImage}
            alt={alt}
            className="w-full h-full object-cover relative z-10"
            onError={handleCloudinaryError}
            {...rest}
          />
        )}
      </div>
    );
  }

  // Cloudinary 降級或不可用時的傳統圖片顯示
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={showFallback ? fallbackSrc : src || fallbackSrc}
        alt={alt}
        className="w-full h-full object-cover"
        onError={handleImageError}
        {...rest}
      />

      {/* 載入失敗時的指示 */}
      {showFallback && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 opacity-75">
          <span className="text-xs text-gray-500">圖片載入失敗</span>
        </div>
      )}
    </div>
  );
};

// 為不同用途提供專門的圖片組件

/**
 * 動物卡片/列表圖片組件
 * 適用於 Home 頁面的動物卡片和 Data 頁面的動物列表
 */
export const AnimalCardImage = ({ src, alt, className, ...rest }) => (
  <OptimizedImage
    src={src}
    preset="CARD_THUMBNAIL"
    alt={alt}
    className={className}
    {...rest}
  />
);

/**
 * 動物詳情頁圖片組件
 * 適用於 DataItem 頁面的詳細展示
 */
export const AnimalDetailImage = ({ src, alt, className, ...rest }) => (
  <OptimizedImage
    src={src}
    preset="DETAIL_IMAGE"
    alt={alt}
    className={className}
    {...rest}
  />
);

export default OptimizedImage;
