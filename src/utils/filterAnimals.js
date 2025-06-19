export const filterAnimals = (animals, filters) => {
  if (animals.length === 0) return [];

  const sexMap = {
    公: "M",
    母: "F",
    未知: "N",
  };

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