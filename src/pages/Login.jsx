import { useNavigate } from "react-router";
import { auth, googleProvider } from "../../firebase";
import { signInWithPopup } from "firebase/auth";
import useAuthStore from "../stores/useAuthStore";
import React, { useState } from "react";

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [alert, setAlert] = useState(null); // { type: "success" | "error", message: string }

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      login({
        avatarUrl: user.photoURL || "https://i.pravatar.cc/40", // 預設頭像
        displayName: user.displayName || "未命名",
        email: user.email || "",
      });

      setAlert({
        type: "success",
        message: "登入成功！",
      });
      setTimeout(() => {
        setAlert(null);
        navigate("/profile");
      }, 2000);
    } catch (error) {
      setAlert({
        type: "error",
        message: "登入失敗：" + error.message,
      });
      setTimeout(() => setAlert(null), 2000);
    }
  };

  return (
    <div className="w-10/12 flex flex-col items-center justify-center gap-4 mx-auto my-10">
      {alert && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50`}
          style={{ background: "rgba(0,0,0,0.2)" }}
        >
          <div
            className={`alert alert-${alert.type} flex items-center w-fit rounded shadow-lg p-6`}
          >
            {alert.type === "success" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current mr-2"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current mr-2"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
            <span>{alert.message}</span>
          </div>
        </div>
      )}
      <button className="btn" onClick={handleGoogleLogin}>
        Login with Google
      </button>
    </div>
  );
}
