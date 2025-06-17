const API_URL = "https://data.moa.gov.tw/Service/OpenData/TransService.aspx?UnitId=QcbUEzN6E6DL";

/**
 * 取得動物資料的API函式
 * @returns {Promise<Array>} 回傳動物資料陣列
 */
export const fetchAnimals = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("載入動物資料失敗:", error);
    throw error;
  }
};

/**
 * 篩選動物資料的函式
 * @param {Array} animals - 原始動物資料陣列
 * @param {Object} filters - 篩選條件物件
 * @param {string} filters.area - 地區篩選
 * @param {string} filters.type - 種類篩選
 * @param {string} filters.sex - 性別篩選
 * @returns {Array} 篩選後的動物資料陣列
 */
export const filterAnimals = (animals, filters) => {
  if (animals.length === 0) return [];

  const sexMap = {
    公: "M",
    母: "F",
    未知: "N",
  };

  console.log("篩選條件:", filters);
  console.log("原始資料數量:", animals.length);

  const result = animals.filter((animal) => {
    // 地區篩選
    const areaMatch = 
      filters.area === "" || animal.animal_place?.includes(filters.area);

    // 種類篩選
    let typeMatch = true;
    if (filters.type !== "") {
      if (filters.type === "貓") {
        typeMatch = animal.animal_kind?.includes("貓");
      } else if (filters.type === "狗") {
        typeMatch = animal.animal_kind?.includes("狗");
      } else if (filters.type === "其他") {
        typeMatch = 
          !animal.animal_kind?.includes("貓") && 
          !animal.animal_kind?.includes("狗");
      }
    }

    // 性別篩選
    const sexMatch = 
      filters.sex === "" || animal.animal_sex === sexMap[filters.sex];

    return areaMatch && typeMatch && sexMatch;
  });

  console.log("篩選後資料數量:", result.length);
  return result;
};