import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/public/Home";
import ForFamily from "./features/family/pages/ForFamily";
import Services from "./features/family/pages/Services";
import CaregiverList from "./features/family/pages/CaregiverList";
import CaregiverProfile from "./features/family/pages/CaregiverProfile";
import Chat from "./features/family/pages/Chat";
import Checkout from "./features/family/pages/Checkout";
import ForCaregiver from "./features/caregiver/pages/ForCaregiver";
import ChooseRole from "./features/caregiver/pages/ChooseRole";
import Verification from "./features/caregiver/pages/Verification";
import CaregiverLayout from "./layouts/CaregiverLayout";
import CaregiverDashboard from "./features/caregiver/pages/CaregiverDashboard";
import CaregiverSchedule from "./features/caregiver/pages/CaregiverSchedule";
import CaregiverBookingRequests from "./features/caregiver/pages/CaregiverBookingRequests";
import CaregiverReview from "./features/caregiver/pages/CaregiverReview";
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
            <Route path="/caregiver" element={<ForCaregiver />} />
          </Route>

          {/* Trang chọn loại dịch vụ có header độc lập */}
          <Route path="/services" element={<Services />} />

          {/* Caregiver flow — trang có header riêng */}
          <Route path="/caregiver/choose-role" element={<ChooseRole />} />
          <Route path="/caregiver/verification" element={<Verification />} />

          {/* Caregiver Dashboard — layout riêng với sidebar */}
          <Route element={<CaregiverLayout />}>
            <Route path="/caregiver/dashboard" element={<CaregiverDashboard />} />
            <Route path="/caregiver/schedule" element={<CaregiverSchedule />} />
            <Route path="/caregiver/bookings" element={<CaregiverBookingRequests />} />
            <Route path="/caregiver/review" element={<CaregiverReview />} />
          </Route>
        </Routes>
      </PageTransition>
    </BrowserRouter>
  );
}