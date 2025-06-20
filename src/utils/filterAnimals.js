export const filterAnimals = (animals, filters) => {
  if (!Array.isArray(animals) || animals.length === 0) return [];

  const sexMap = {
    公: "M",
    母: "F",
    未知: "N",
  };

  const result = animals.filter((animal) => {
    const { area, type, sex } = filters;

    // 地區比對（若未設定則通過）
    const areaMatch = !area || animal.animal_place?.includes(area);

    // 種類比對
    const kind = animal.animal_kind || "";
    const typeMatch =
      !type ||
      (type === "貓" && kind.includes("貓")) ||
      (type === "狗" && kind.includes("狗")) ||
      (type === "其他" && !kind.includes("貓") && !kind.includes("狗"));

    // 性別比對
    const sexMatch = !sex || animal.animal_sex === sexMap[sex];

    return areaMatch && typeMatch && sexMatch;
  });
  return result;
};
// 1. sexMap 可以抽出到檔案外部共用（如果常用）
// 這樣之後如果性別代碼或文字有更動，只需改一處。

// 2. 篩選條件可以統一寫成布林邏輯，避免巢狀 if
// 將 typeMatch 用同樣的邏輯寫成條件運算，會讓整體風格一致。

// 3. includes 搭配非空字串的判斷可更簡潔
// filters.area === "" || includes(...) 是 OK 的，但可以稍微簡化判斷。