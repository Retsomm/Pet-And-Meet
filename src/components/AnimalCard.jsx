import React from "react";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router";
import { useFavorite } from "../hooks/useFavorite";
import AnimalSkeleton from "./AnimalSkeleton"; // 新增這行

const sexDisplay = {
  M: "公",
  F: "母",
  N: "未知",
};

const AnimalCard = React.memo(({ animal, onViewDetail, from = "data" }) => {
  const { isCollected, toggleFavorite, isLoggedIn } = useFavorite(animal);
  const navigate = useNavigate();
  const { ref: inViewRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "/default.jpg";
  };

  const handleDetailClick = () => {
    if (onViewDetail) {
      onViewDetail(animal);
    } else {
      navigate(`/animal/${animal.animal_id}`, { state: { from } });
    }
  };

  return (
    <div
      ref={inViewRef}
      className="card bg-base-100 w-96 shadow-xl gap-3 m-3 relative min-h-60"
    >
      {!inView && <AnimalSkeleton />}
      <div
        className={`transition-opacity duration-300 ${
          inView ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex min-h-60 w-96">
          <figure className="w-1/2 flex-shrink-0 aspect-square">
            <img
              src={animal.album_file || "/default.webp"}
              alt={animal.animal_Variety}
              className="object-cover"
              loading="lazy"
              onError={handleImageError}
            />
          </figure>
          <div className="card-body w-1/2 p-4 overflow-hidden">
            <h2 className="card-title truncate">{animal.animal_Variety}</h2>
            <p className="truncate">地區：{animal.animal_place?.slice(0, 3)}</p>
            <p>性別：{sexDisplay[animal.animal_sex]}</p>
            <p>顏色：{animal.animal_colour}</p>
            <p>體型：{animal.animal_bodytype}</p>
            <div className="card-actions justify-end mt-2 flex-nowrap">
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

AnimalCard.displayName = "AnimalCard";

export default React.memo(AnimalCard);
