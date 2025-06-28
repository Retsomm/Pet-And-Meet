import { useEffect } from "react";
import { useLocation } from "react-router";

/**
 * ScrollToTop 組件
 * 監聽路由變化，每次切換頁面時自動滾動到頂部
 */
function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
}

export default ScrollToTop;
