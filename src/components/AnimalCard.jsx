import React from "react";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router";
import { useFavorite } from "../hooks/useFavorite";
import { AnimalCardImage } from "./OptimizedImage";
import AnimalSkeleton from "./AnimalSkeleton";

// 性別顯示對照表
const sexDisplay = {
  M: "公",
  F: "母",
  N: "未知",
};

/**
 * 動物卡片元件
 * @param {Object} props
 * @param {Object} props.animal - 動物資料物件
 * @param {Function} [props.onViewDetail] - 點擊詳細資料時的回呼
 * @param {string} [props.from="data"] - 來源標記（用於路由狀態）
 */
const AnimalCard = React.memo(({ animal, onViewDetail, from = "data" }) => {
  // 收藏 hook，取得收藏狀態與切換函式
  const { isCollected, toggleFavorite, isLoggedIn } = useFavorite(animal);
  // 路由導覽 hook
  const navigate = useNavigate();
  // Intersection Observer hook，判斷卡片是否進入視窗
  const { ref: inViewRef, inView } = useInView({
    triggerOnce: true, // 只觸發一次
    threshold: 0.1, // 進入 10% 即觸發
  });

  // 圖片載入失敗時顯示預設圖
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "/default.webp";
  };

  // 點擊詳細資料按鈕時的處理
  const handleDetailClick = () => {
    if (onViewDetail) {
      // 若有傳入 onViewDetail，則呼叫
      onViewDetail(animal);
    } else {
      // 否則導向詳細頁，並帶上來源資訊
      navigate(`/animal/${animal.animal_id}`, { state: { from } });
    }
  };

  return (
    <div
      ref={inViewRef}
      className="card bg-base-100 w-96 shadow-xl gap-3 m-3 relative min-h-60"
    >
      {/* 若尚未進入視窗則顯示骨架畫面 */}
      {!inView && <AnimalSkeleton />}
      <div
        className={`transition-opacity duration-300 ${
          inView ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex min-h-60 w-96">
          {/* 動物圖片區塊 */}
          <figure className="w-1/2 flex-shrink-0 aspect-square">
            <AnimalCardImage
              src={animal.album_file}
              alt={animal.animal_Variety}
              className="w-full h-full"
              loading="lazy"
              onError={handleImageError}
            />
          </figure>
          {/* 動物資訊區塊 */}
          <div className="card-body w-1/2 p-4 overflow-hidden">
            <h2 className="card-title truncate">{animal.animal_Variety}</h2>
            <p className="truncate">地區：{animal.animal_place?.slice(0, 3)}</p>
            <p>性別：{sexDisplay[animal.animal_sex]}</p>
            <p>顏色：{animal.animal_colour}</p>
            <p>體型：{animal.animal_bodytype}</p>
            {/* 按鈕區塊 */}
            <div className="card-actions justify-end mt-2 flex-nowrap">
              {/* 收藏按鈕 */}
              <button
                className="btn btn-ghost btn-sm"
                disabled={!isLoggedIn}
                onClick={toggleFavorite}
                aria-label={isCollected ? "已收藏" : "收藏"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill={isCollected ? "currentColor" : "none"}
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                  />
                </svg>
              </button>
              {/* 詳細資料按鈕 */}
              <button
                className="btn btn-primary btn-sm"
                onClick={handleDetailClick}
              >
                詳細資料
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// 設定 displayName 方便除錯
AnimalCard.displayName = "AnimalCard";

// 導出元件（再次 memo 包裝避免重複渲染）
export default React.memo(AnimalCard);
