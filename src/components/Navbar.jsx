import { Link } from "react-router";
import ThemeToggle from "./ThemeToggle";
export default function Navbar({ currentTheme, onToggleTheme }) {
  return (
    <div className="navbar bg-base-100 shadow-lg fixed top-0 l-0 z-50 max-sm:hidden">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">毛孩相遇站</a>
      </div>
      <div className="flex-none mx-10">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/" className="navLink">
              <p className="text-lg font-bold">首頁</p>
            </Link>
          </li>
          <li>
            <Link to="/data" className="navLink">
              <p className="text-lg font-bold">收藏</p>
            </Link>
          </li>
          <li>
            <Link to="/login" className="navLink">
              <p className="text-lg font-bold">會員</p>
            </Link>
          </li>
          <li>
            <div
              className="navLink flex items-center tooltip tooltip-bottom"
              data-tip="switchTheme"
            >
              <span className="text-sm"></span>
              <ThemeToggle
                currentTheme={currentTheme}
                onToggleTheme={onToggleTheme}
              />
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
