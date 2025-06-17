import React, { useEffect, useState, useMemo, useCallback } from "react";
// 引入新建立的API檔案和卡片元件
import { fetchAnimals, filterAnimals } from "../components/animalAPI";
import AnimalCard from "../components/AnimalCard";

// 篩選選單元件 (沒有修改)
const AREAS = [
  "全部",
  "宜蘭縣",
  "臺南市",
  "澎湖縣",
  "新北市",
  "臺北市",
  "臺東縣",
  "桃園市",
  "苗栗縣",
  "花蓮縣",
  "金門縣",
  "新竹市",
  "彰化縣",
  "嘉義市",
  "雲林縣",
  "臺中市",
  "基隆市",
  "南投縣",
  "屏東縣",
  "嘉義縣",
  "連江縣",
];
const TYPES = ["全部", "貓", "狗", "其他"];
const SEXES = ["全部", "公", "母", "未知"];

const AnimalFilterMenu = ({
  filters,
  setFilters,
  onConfirm,
  onReset,
  onClose,
}) => (
  <div className="fixed w-screen h-screen top-0 left-0 z-50 p-8 overflow-auto bg-base-100">
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-2xl font-bold">篩選條件</h2>
      <button className="text-2xl" onClick={onClose}>
        ×
      </button>
    </div>
    <div className="mb-6">
      <div className="mb-2 font-bold">地區</div>
      <div className="flex flex-wrap gap-2">
        {AREAS.map((area) => (
          <button
            key={area}
            className={`btn btn-outline btn-sm ${
              filters.area === area || (filters.area === "" && area === "全部")
                ? "btn-info"
                : ""
            }`}
            onClick={() =>
              setFilters((f) => ({ ...f, area: area === "全部" ? "" : area }))
            }
          >
            {area}
          </button>
        ))}
      </div>
    </div>
    <div className="mb-6">
      <div className="mb-2 font-bold">種類</div>
      <div className="flex gap-2">
        {TYPES.map((type) => (
          <button
            key={type}
            className={`btn btn-outline btn-sm ${
              filters.type === type || (filters.type === "" && type === "全部")
                ? "btn-info"
                : ""
            }`}
            onClick={() =>
              setFilters((f) => ({ ...f, type: type === "全部" ? "" : type }))
            }
          >
            {type}
          </button>
        ))}
      </div>
    </div>
    <div className="mb-6">
      <div className="mb-2 font-bold">性別</div>
      <div className="flex gap-2">
        {SEXES.map((sex) => (
          <button
            key={sex}
            className={`btn btn-outline btn-sm ${
              filters.sex === sex || (filters.sex === "" && sex === "全部")
                ? "btn-info"
                : ""
            }`}
            onClick={() =>
              setFilters((f) => ({ ...f, sex: sex === "全部" ? "" : sex }))
            }
          >
            {sex}
          </button>
        ))}
      </div>
    </div>
    <div className="flex gap-4 mt-12">
      <button className="btn btn-outline flex-1" onClick={onReset}>
        重置
      </button>
      <button className="btn btn-outline flex-1" onClick={onConfirm}>
        確認
      </button>
    </div>
  </div>
);

const Data = () => {
  const [animals, setAnimals] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({ area: "", type: "", sex: "" });
  const [loading, setLoading] = useState(true);

  // 分頁相關狀態
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  // 使用新的API函式來載入資料
  useEffect(() => {
    const loadAnimals = async () => {
      try {
        setLoading(true);
        const data = await fetchAnimals();
        setAnimals(data);
      } catch (error) {
        console.error("載入動物資料時發生錯誤:", error);
        // 可以在這裡加入錯誤處理，例如顯示錯誤訊息
      } finally {
        setLoading(false);
      }
    };

    loadAnimals();
  }, []);

  // 使用新的篩選函式
  const filteredAnimals = useMemo(() => {
    return filterAnimals(animals, filters);
  }, [animals, filters]);

  // 計算當前頁面要顯示的資料
  const currentAnimals = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAnimals.slice(startIndex, endIndex);
  }, [filteredAnimals, currentPage, itemsPerPage]);

  // 計算總頁數
  const totalPages = Math.ceil(filteredAnimals.length / itemsPerPage);

  // 篩選條件改變時重設頁面
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleFilter = useCallback(() => {
    setShowFilter(false);
  }, []);

  const handleReset = useCallback(() => {
    setFilters({ area: "", type: "", sex: "" });
    setShowFilter(false);
  }, []);

  // 換頁功能
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // 處理收藏功能（可以自訂）
  const handleFavorite = useCallback((animal) => {
    console.log("收藏動物:", animal.animal_id);
    // 在這裡加入收藏邏輯，例如存到 localStorage 或發送到後端
  }, []);

  // 處理查看詳細資料功能（可以自訂）
  const handleViewDetail = useCallback((animal) => {
    console.log("查看詳細資料:", animal.animal_id);
    // 在這裡加入詳細資料邏輯，例如開啟 modal 或跳轉頁面
  }, []);

  return (
    <div className="relative min-h-screen sm:pt-10">
      {/* 篩選按鈕區域 */}
      <div className="top-17 left-0 right-0 shadow-sm z-40 flex justify-center items-center">
        <div className="flex justify-center items-center py-4 px-4 w-screen">
          <button
            className="btn btn-outline bg-base-100"
            onClick={() => setShowFilter(true)}
          >
            🔍 篩選條件
          </button>
        </div>
      </div>

      {showFilter && (
        <AnimalFilterMenu
          filters={filters}
          setFilters={setFilters}
          onConfirm={handleFilter}
          onReset={handleReset}
          onClose={() => setShowFilter(false)}
        />
      )}

      {loading ? (
        <div className="flex items-center justify-center h-[60vh]">
          <span className="loading loading-infinity loading-lg"></span>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap pt-24 justify-center items-center px-4">
            {currentAnimals.map((animal) => (
              <AnimalCard
                key={animal.animal_id}
                animal={animal}
                onFavorite={handleFavorite}
                onViewDetail={handleViewDetail}
              />
            ))}
          </div>

          {/* 分頁按鈕 */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 my-8">
              <button
                className="btn btn-outline btn-sm"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                上一頁
              </button>

              {/* 顯示頁碼 */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    className={`btn btn-sm ${
                      currentPage === pageNum ? "btn-primary" : "btn-outline"
                    }`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                className="btn btn-outline btn-sm"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                下一頁
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Data;
