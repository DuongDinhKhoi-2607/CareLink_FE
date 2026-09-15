import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/public/Home";
import ForFamily from "./features/family/pages/ForFamily";
import Services from "./features/family/pages/Services";
import CaregiverList from "./features/family/pages/CaregiverList";
import CaregiverProfile from "./features/family/pages/CaregiverProfile";
import Chat from "./features/family/pages/Chat";
import Checkout from "./features/family/pages/Checkout";
import PageTransition from "./components/PageTransition";

export default function App() {
  return (
    <BrowserRouter>
      <PageTransition>
        <Routes>
          {/* Nhóm các trang công khai dùng chung Header + Footer */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/family" element={<ForFamily />} />
            <Route path="/caregivers" element={<CaregiverList />} />
            <Route path="/caregivers/profile" element={<CaregiverProfile />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/checkout" element={<Checkout />} />
          </Route>

          {/* Trang chọn loại dịch vụ có header độc lập */}
          <Route path="/services" element={<Services />} />
        </Routes>
      </PageTransition>
    </BrowserRouter>
  );
}