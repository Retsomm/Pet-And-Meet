import "./App.css";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Data from "./pages/Data";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import DataItem from "./pages/DataItem";
import Collect from "./pages/Collect";
import { BrowserRouter, Routes, Route } from "react-router";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/data" element={<Data />} />
          <Route path="/animal/:id" element={<DataItem />} />
          <Route path="/collect" element={<Collect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
