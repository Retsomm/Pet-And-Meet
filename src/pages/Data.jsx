import React, { useState, useMemo, useCallback } from "react";
import { useFetchAnimals } from "../hooks/useFetchAnimals";
import { filterAnimals } from "../utils/filterAnimals";
import AnimalCard from "../components/AnimalCard";
import { useUserCollects } from "../hooks/useUserCollects";
import AnimalFilterMenu from "../components/AnimalFilterMenu";

const Data = () => {
  const { animals, loading, error } = useFetchAnimals();
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({ area: "", type: "", sex: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const collects = useUserCollects();

  // 篩選後的動物資料
  const filteredAnimals = useMemo(() => {
    return filterAnimals(animals, filters);
  }, [animals, filters]);

  // 分頁
  const currentAnimals = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAnimals.slice(startIndex, endIndex);
  }, [filteredAnimals, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAnimals.length / itemsPerPage);

  // 篩選條件改變時重設頁面
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters]);
  // 當 animals 改變時重設頁面
  const handleFilter = useCallback(() => {
    setShowFilter(false);
  }, []);
  // 重置篩選條件
  const handleReset = useCallback(() => {
    setFilters({ area: "", type: "", sex: "" });
    setShowFilter(false);
  }, []);
  // 分頁按鈕點擊處理
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
      {/* 篩選條件選單 */}
      {showFilter && (
        <AnimalFilterMenu
          filters={filters}
          setFilters={setFilters}
          onConfirm={handleFilter}
          onReset={handleReset}
          onClose={() => setShowFilter(false)}
        />
      )}
      {/* 動物卡片區域 */}
      {loading ? (
        <div className="flex items-center justify-center h-[60vh]">
          <span className="loading loading-infinity loading-lg"></span>
        </div>
      ) : error ? (
        <div className="text-center mt-10">資料載入失敗</div>
      ) : (
        <>
          <div className="flex flex-wrap pt-24 justify-center items-center px-4">
            {currentAnimals.map((animal) => {
              const isCollected = collects.some(
                (item) => item.animal_id === animal.animal_id
              );
              return (
                <AnimalCard
                  key={animal.animal_id}
                  animal={animal}
                  isCollected={isCollected}
                  from="data"
                />
              );
            })}
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
