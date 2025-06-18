import { Link } from "react-router";
import ThemeToggle from "./ThemeToggle";
import useAuthStore from "../store/useAuthStore";

export default function Navbar() {
  const { isLoggedIn, user } = useAuthStore();

  return (
    <div className="navbar bg-base-100 shadow-lg fixed top-0 l-0 z-50 max-sm:hidden">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">毛孩相遇站</a>
      </div>
      <div className="flex-none mx-10">
        <ul className="menu menu-horizontal px-1 items-center">
          <li>
            <Link to="/" className="navLink">
              <p className="text-lg font-bold">首頁</p>
            </Link>
          </li>
          <li>
            <Link to="/data" className="navLink">
              <p className="text-lg font-bold">毛孩們</p>
            </Link>
          </li>
          <li>
            <Link to="/collect" className="navLink">
              <p className="text-lg font-bold">收藏</p>
            </Link>
          </li>
          <li>
            {isLoggedIn ? (
              <Link to="/profile" className="navLink">
                <img
                  src={user?.avatarUrl || "https://i.pravatar.cc/40"}
                  alt="User Avatar"
                  className="w-12 h-auto cursor-pointer"
                />
              </Link>
            ) : (
              <Link to="/login" className="navLink">
                <p className="text-lg font-bold">登入</p>
              </Link>
            )}
          </li>
          <li>
            <div
              className="navLink flex items-center tooltip tooltip-bottom"
              data-tip="switchTheme"
            >
              <span className="text-sm"></span>
              <ThemeToggle />
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
