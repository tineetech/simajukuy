import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Community from "./pages/Community";
import Article from "./pages/Article";
import ArticleDetail from "./pages/ArticleDetail";
import Header from "./components/Navigations/Header";
import Footer from "./components/Navigations/Footer";

export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/komunitas" element={<Community />} />
        <Route path="/artikel" element={<Article />} />
        <Route path="/artikel/:id" element={<ArticleDetail />} />
      </Routes>
      <Footer />
    </Router>
  )
}