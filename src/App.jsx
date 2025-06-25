import "./App.css";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Data from "./pages/Data";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import DataItem from "./pages/DataItem";
import Collect from "./pages/Collect";
import ProtectedRoute from "./components/ProtectedRoute";
import { BrowserRouter, Routes, Route } from "react-router";
import useAuthStore from "./stores/useAuthStore";
import { useEffect } from "react";
function App() {
  const { isLoading, init } = useAuthStore();

  useEffect(() => {
    init();
  }, [init]);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/data" element={<Data />} />
          <Route path="/animal/:id" element={<DataItem />} />
          <Route path="/collect" element={<Collect />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
