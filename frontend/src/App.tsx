import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CommunityPage from "./pages/CommunityPage";
import ArticlePage from "./pages/ArticlePage";
import ArticleDetailPage from "./pages/ArticleDetailPage";
import Dashboard from "./pages/Dashboard";
import AdminLayout from "./layouts/AdminLayout";
import MainLayout from "./layouts/MainLayout";
import ReportPage from "./pages/ReportPage";
import ReviewReportPage from "./pages/ReviewReportPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ResetPassPage from "./pages/ResetPassPage";
import VerifyResetPassPage from "./pages/VerifyResetPassPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="komunitas" element={<CommunityPage />} />
          <Route path="lapor" element={<ReportPage />} />
          <Route path="artikel" element={<ArticlePage />} />
          <Route path="artikel/:id" element={<ArticleDetailPage />} />

          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="reset-password" element={<ResetPassPage />} />
          <Route path="verification/reset-password/:tokenReset" element={<VerifyResetPassPage />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="laporan" element={<ReviewReportPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
