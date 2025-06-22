import React from "react";
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
  <div className="fixed w-screen h-screen top-0 left-0 z-50 p-8 bg-base-100 overflow-y-auto">
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
                ? "btn-primary"
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
                ? "btn-primary"
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
                ? "btn-primary"
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

export default React.memo(AnimalFilterMenu);
