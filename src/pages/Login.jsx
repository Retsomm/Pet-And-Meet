import { useNavigate } from "react-router";
import { auth, googleProvider } from "../../firebase";
import { signInWithPopup } from "firebase/auth";
import useAuthStore from "../store/useAuthStore";

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("Google user:", user); // 檢查 user 內容

      login({
        avatarUrl: user.photoURL || "https://i.pravatar.cc/40", // 預設頭像
        displayName: user.displayName || "未命名",
        email: user.email || "",
      });
      navigate("/profile");
    } catch (error) {
      alert("登入失敗：" + error.message);
    }
  };

  return (
    <div className="w-10/12 flex flex-col items-center justify-center gap-4 mx-auto my-10">
      <button className="btn" onClick={handleGoogleLogin}>
        Login with Google
      </button>
    </div>
  );
}
