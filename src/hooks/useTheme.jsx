import { useState, useEffect } from "react";

export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState("valentine");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "valentine";
    setCurrentTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = currentTheme === "valentine" ? "sunset" : "valentine";

    setCurrentTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return { currentTheme, toggleTheme };
};
