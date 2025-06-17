import "./App.css";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Data from "./pages/Data";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import { BrowserRouter, Routes, Route } from "react-router";
import { useTheme } from "./hooks/useTheme";
function App() {
  const { currentTheme, toggleTheme } = useTheme();
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout currentTheme={currentTheme} onToggleTheme={toggleTheme} />
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/data" element={<Data />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
