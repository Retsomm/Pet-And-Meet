import React from "react";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router";
import { useFavorite } from "../hooks/useFavorite";

// 性別顯示對照表
const sexDisplay = {
  M: "公",
  F: "母",
  N: "未知",
};

const AnimalCard = React.memo(({ animal, onViewDetail, from = "data" }) => {
  const { isCollected, toggleFavorite, isLoggedIn } = useFavorite(animal);
  const [showLoginAlert, setShowLoginAlert] = React.useState(false);
  const navigate = useNavigate();
  // 使用 Intersection Observer 來懶加載圖片
  // 當卡片進入視窗時才載入圖片
  const { ref: inViewRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // 處理圖片載入錯誤
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "/default.jpg";
  };

  // 處理詳細資料按鈕點擊
  const handleDetailClick = () => {
    if (onViewDetail) {
      onViewDetail(animal);
    } else {
      navigate(`/animal/${animal.animal_id}`, { state: { from } });
    }
  };

  return (
    <div ref={inViewRef} className="card bg-base-100 w-96 shadow-xl gap-3 m-3">
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
                className="btn btn-ghost btn-sm"
                disabled={!isLoggedIn}
                onClick={async (e) => {
                  console.log("isLoggedIn", isLoggedIn);
                  if (!isLoggedIn) {
                    e.preventDefault();
                    setShowLoginAlert(true);
                    setTimeout(() => setShowLoginAlert(false), 2000);
                    return;
                  }
                  await toggleFavorite();
                }}
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
              {showLoginAlert && (
                <div className="alert alert-error fixed top-4 left-1/2 -translate-x-1/2 z-50">
                  請先登入
                </div>
              )}
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

AnimalCard.displayName = "AnimalCard";

export default AnimalCard;
