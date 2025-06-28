import React from "react";
const AREAS = [
  "全部",
  "新北市",
  "臺北市",
  "桃園市",
  "新竹市",
  "苗栗縣",
  "臺中市",
  "南投縣",
  "彰化縣",
  "雲林縣",
  "嘉義市",
  "嘉義縣",
  "臺南市",
  "屏東縣",
  "基隆市",
  "宜蘭縣",
  "花蓮縣",
  "臺東縣",
  "澎湖縣",
  "金門縣",
  "連江縣",
];
const TYPES = ["全部", "貓", "狗", "其他"];
const SEXES = ["全部", "公", "母", "未知"];

// 抽出共用的按鈕群組元件
const FilterButtonGroup = ({
  label,
  options,
  value,
  onChange,
  className = "",
}) => (
  <div className={`mb-6 ${className}`}>
    <div className="mb-2 font-bold">{label}</div>
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          className={`btn btn-outline btn-sm ${
            value === option || (value === "" && option === "全部")
              ? "btn-primary"
              : ""
          }`}
          onClick={() => onChange(option === "全部" ? "" : option)}
        >
          {option}
        </button>
      ))}
    </div>
  </div>
);

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
    <FilterButtonGroup
      label="地區"
      options={AREAS}
      value={filters.area}
      onChange={(area) => setFilters((f) => ({ ...f, area }))}
    />
    <FilterButtonGroup
      label="種類"
      options={TYPES}
      value={filters.type}
      onChange={(type) => setFilters((f) => ({ ...f, type }))}
      className="flex-nowrap"
    />
    <FilterButtonGroup
      label="性別"
      options={SEXES}
      value={filters.sex}
      onChange={(sex) => setFilters((f) => ({ ...f, sex }))}
      className="flex-nowrap"
    />
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
