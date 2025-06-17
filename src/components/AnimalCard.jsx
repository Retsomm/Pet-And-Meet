import React from "react";
import { useInView } from "react-intersection-observer";

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
 * @param {Function} props.onFavorite - 收藏按鈕點擊處理函式（可選）
 * @param {Function} props.onViewDetail - 詳細資料按鈕點擊處理函式（可選）
 */
const AnimalCard = React.memo(({ animal, onFavorite, onViewDetail }) => {
  const { ref, inView } = useInView({ 
    triggerOnce: true, 
    threshold: 0.1 
  });

  // 處理圖片載入錯誤
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "/default.jpg";
  };

  // 處理收藏按鈕點擊
  const handleFavoriteClick = () => {
    if (onFavorite) {
      onFavorite(animal);
    } else {
      console.log("收藏動物:", animal.animal_id);
      // 這裡可以加入預設的收藏邏輯
    }
  };

  // 處理詳細資料按鈕點擊
  const handleDetailClick = () => {
    if (onViewDetail) {
      onViewDetail(animal);
    } else {
      console.log("查看詳細資料:", animal.animal_id);
      // 這裡可以加入預設的詳細資料邏輯
    }
  };

  return (
    <div ref={ref} className="card bg-base-100 w-96 shadow-xl gap-3 m-3">
      {inView && (
        <div className="flex">
          <figure className="w-1/2 flex-shrink-0">
            <img
              src={animal.album_file || "/default.jpg"}
              alt={animal.animal_Variety}
              className="object-cover w-full h-full"
              loading="lazy"
              onError={handleImageError}
            />
          </figure>
          <div className="card-body w-1/2 p-4">
            <h2 className="card-title">{animal.animal_Variety}</h2>
            <p>地區：{animal.animal_place}</p>
            <p>性別：{sexDisplay[animal.animal_sex]}</p>
            <p>顏色：{animal.animal_colour}</p>
            <p>體型：{animal.animal_bodytype}</p>
            <div className="card-actions justify-end mt-2">
              <button 
                className="btn btn-primary btn-sm"
                onClick={handleFavoriteClick}
              >
                收藏
              </button>
              <button 
                className="btn btn-primary btn-sm"
                onClick={handleDetailClick}
              >
                詳細資料
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

// 設定元件顯示名稱，方便除錯
AnimalCard.displayName = 'AnimalCard';

export default AnimalCard;