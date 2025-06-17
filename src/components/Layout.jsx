import Navbar from "./Navbar";
import Dock from "./Dock";
import { Outlet } from "react-router";
export default function Layout({ currentTheme, onToggleTheme }) {
  return (
    <div>
      <Navbar currentTheme={currentTheme} onToggleTheme={onToggleTheme} />
      <main className="min-h-screen flex flex-col justify-center items-center z-0 sm:mt-10 m-3">
        <Outlet />
      </main>
      <Dock currentTheme={currentTheme} onToggleTheme={onToggleTheme} />
    </div>
  );
}
