import { useEffect, useState } from "react";

export function useWebpImage(src) {
  const [webpSrc, setWebpSrc] = useState(src);

  useEffect(() => {
    let revoked = false;
    if (!src) {
      setWebpSrc("");
      return;
    }

    // 檢查瀏覽器是否支援 WebP
    const canUseWebp = document.createElement("canvas").toDataURL("image/webp").indexOf("data:image/webp") === 0;
    if (!canUseWebp) {
      setWebpSrc(src);
      return;
    }

    fetch(src)
      .then(res => res.blob())
      .then(blob => createImageBitmap(blob))
      .then(bitmap => {
        const canvas = document.createElement("canvas");
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(bitmap, 0, 0);
        const webpDataUrl = canvas.toDataURL("image/webp", 0.8);
        if (!revoked) setWebpSrc(webpDataUrl);
      })
      .catch(() => setWebpSrc(src));

    return () => {
      revoked = true;
    };
  }, [src]);

  return webpSrc;
}