import React from "react";
import { useLocation, useParams, useNavigate } from "react-router";
import { useFetchAnimals } from "../hooks/useFetchAnimals";
import { useFavorite } from "../hooks/useFavorite";

const keyMap = {
  animal_id: "動物流水編號",
  animal_subid: "動物管理編號",
  animal_area_pkid: "動物所屬地區",
  animal_shelter_pkid: "動物所屬收容所",
  animal_place: "動物實際所在地",
  animal_kind: "動物種類",
  animal_Variety: "動物品種",
  animal_sex: "動物性別",
  animal_bodytype: "動物體型",
  animal_colour: "動物毛色",
  animal_age: "動物年齡",
  animal_sterilization: "是否絕育",
  animal_bacterin: "是否施打疫苗",
  animal_foundplace: "動物尋獲地",
  animal_title: "動物標題",
  animal_status: "動物狀態",
  animal_remark: "備註",
  animal_caption: "其他說明",
  animal_opendate: "開放認養時間",
  animal_closeddate: "結案時間",
  animal_update: "資料更新時間",
  animal_createtime: "資料建立時間",
  shelter_name: "收容所名稱",
  album_file: "圖片",
  album_update: "圖片資料更新時間",
  cDate: "領養公告日期",
  shelter_address: "收容所地址",
  shelter_tel: "收容所電話",
};

export default function DataItem() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { animals, loading, error } = useFetchAnimals();
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMsg, setAlertMsg] = React.useState("");
  const animal = React.useMemo(
    () => animals.find((a) => String(a.animal_id) === id),
    [animals, id]
  );

  const { isCollected, toggleFavorite } = useFavorite(animal);

  if (loading) return <span className="loading loading-ring loading-lg"></span>;
  if (error) return <div className="text-center mt-10">資料載入失敗</div>;
  if (!animal) return <div className="text-center mt-10">找不到毛孩資料</div>;

  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    animal.animal_place || ""
  )}`;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-base-100 shadow-lg rounded-lg p-6">
      <div className="mb-4">
        {/* Object.entries(obj) 是將物件轉成可迴圈的 [[key, value]] 陣列 */}
        {Object.entries(animal).map(([key, value]) => (
          <div key={key} className="text-sm border-b py-1 flex">
            <span className="font-bold w-40">{keyMap[key] || key}：</span>
            <span className="flex-1 break-all">
              {key === "album_file" ? (
                <img src={value} alt="動物圖片" className="max-h-32" />
              ) : (
                String(value)
              )}
            </span>
          </div>
        ))}
      </div>
      <a
        href={mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn w-full mb-4"
      >
        Google Map 導航
      </a>
      <button
        className={`btn w-full mb-4 ${
          isCollected ? "btn-error" : "btn-warning"
        }`}
        onClick={async () => {
          try {
            const result = await toggleFavorite();
            if (result === false) {
              setAlertMsg("請先登入才能收藏");
            } else {
              setAlertMsg(isCollected ? "已取消收藏" : "已收藏");
            }
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 2000);
          } catch {
            setAlertMsg("請先登入才能收藏");
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 2000);
          }
        }}
      >
        {isCollected ? "取消收藏" : "收藏這隻毛孩"}
      </button>
      <button
        className="btn btn-outline w-full"
        onClick={() => {
          if (location.state?.from === "collect") {
            navigate("/collect");
          } else if (location.state?.from === "/") {
            navigate("/");
          } else {
            navigate("/data");
          }
        }}
      >
        回到上一頁
      </button>
      {showAlert && (
        <div
          role="alert"
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: "rgba(0,0,0,0.2)" }}
        >
          <div className="alert alert-success flex items-center rounded shadow-lg p-6 w-fit">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current mr-2"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{alertMsg}</span>
          </div>
        </div>
      )}
    </div>
  );
}
