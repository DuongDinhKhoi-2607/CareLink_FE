import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import Home from "./pages/public/Home";
import ForFamily from "./features/family/pages/ForFamily";
import Services from "./features/family/pages/Services";
import CaregiverList from "./features/family/pages/CaregiverList";
import CaregiverProfile from "./features/family/pages/CaregiverProfile";
import Chat from "./features/family/pages/Chat";
import Checkout from "./features/family/pages/Checkout";
import Dashboard from "./features/family/pages/Dashboard";
import Review from "./features/family/pages/Review";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import PageTransition from "./components/PageTransition";

export default function App() {
  return (
    <BrowserRouter>
      <PageTransition>
        <Routes>
          {/* Nhóm các trang Website công khai dùng chung MainLayout (Header + Footer) */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/family" element={<ForFamily />} />
            <Route path="/caregivers" element={<CaregiverList />} />
            <Route path="/caregivers/profile" element={<CaregiverProfile />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/review" element={<Review />} />
          </Route>

          {/* Nhóm Bảng điều khiển dùng riêng DashboardLayout (Sidebar điều hướng chuyên biệt) */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          {/* Các trang xác thực độc lập */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Trang chọn loại dịch vụ có header độc lập */}
          <Route path="/services" element={<Services />} />
        </Routes>
      </PageTransition>
    </BrowserRouter>
  );
}