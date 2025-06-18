import React, { useCallback, useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router";
import { Like } from "../components/Like";
import { getAuth } from "firebase/auth";
import { db } from "../../firebase";
import { ref, onValue } from "firebase/database";
import { remove, query, orderByChild, equalTo, get } from "firebase/database";
// 性別顯示對照表
const sexDisplay = {
  M: "公",
  F: "母",
  N: "未知",
};

const AnimalCard = React.memo(({ animal, onViewDetail, from = "data" }) => {
  const navigate = useNavigate();
  const [isCollected, setIsCollected] = useState(false);
  const { ref: inViewRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // 監聽是否已收藏
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;
    const collectsRef = ref(db, `users/${user.uid}/collects`);
    const unsubscribe = onValue(collectsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setIsCollected(
          Object.values(data).some(
            (item) => item.animal_id === animal.animal_id
          )
        );
      } else {
        setIsCollected(false);
      }
    });
    return () => unsubscribe();
  }, [animal.animal_id]);

  // 處理圖片載入錯誤
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "/default.jpg";
  };

  // 處理收藏按鈕點擊
  const handleFavorite = useCallback(async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const collectsRef = ref(db, `users/${user.uid}/collects`);
    if (!isCollected) {
      // 新增收藏
      await Like(animal);
    } else {
      // 取消收藏
      // 找到該 animal_id 的收藏紀錄
      const q = query(
        collectsRef,
        orderByChild("animal_id"),
        equalTo(animal.animal_id)
      );
      const snapshot = await get(q);
      if (snapshot.exists()) {
        snapshot.forEach((child) => {
          remove(ref(db, `users/${user.uid}/collects/${child.key}`));
        });
      }
    }
  }, [animal, isCollected]);

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
                onClick={handleFavorite}
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
      )}
    </div>
  );
});

AnimalCard.displayName = "AnimalCard";

export default AnimalCard;
