import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Community from "./pages/Community";
import Article from "./pages/Article";
import ArticleDetail from "./pages/ArticleDetail";
import Dashboard from "./pages/Dashboard";
import AdminLayout from "./layouts/AdminLayout";
import MainLayout from "./layouts/MainLayout";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="komunitas" element={<Community />} />
          {/* <Route path="lapor" element={<Lapor />} /> */}
          <Route path="artikel" element={<Article />} />
          <Route path="artikel/:id" element={<ArticleDetail />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}
