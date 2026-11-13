import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import CaregiverLayout from "./layouts/CaregiverLayout";
import AdminLayout from "./layouts/AdminLayout";
import PageTransition from "./components/PageTransition";
import { PageTracker } from "./utils/tracker";
import Home from "./pages/public/Home";

// Lazy-loaded Public & Auth pages
const ForFamily = lazy(() => import("./features/family/pages/ForFamily"));
const CaregiverList = lazy(() => import("./features/family/pages/CaregiverList"));
const CaregiverProfile = lazy(() => import("./features/family/pages/CaregiverProfile"));
const Chat = lazy(() => import("./features/family/pages/Chat"));
const Checkout = lazy(() => import("./features/family/pages/Checkout"));
const PaymentResult = lazy(() => import("./features/family/pages/PaymentResult"));
const Review = lazy(() => import("./features/family/pages/Review"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const MedicalHandbook = lazy(() => import("./pages/public/MedicalHandbook"));
const HandbookDetail = lazy(() => import("./pages/public/HandbookDetail"));
const PrivacyPolicy = lazy(() => import("./pages/public/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/public/TermsOfService"));

// Lazy-loaded Family Dashboard pages
const Dashboard = lazy(() => import("./features/family/pages/Dashboard"));
const Appointments = lazy(() => import("./features/family/pages/Appointments"));
const Relatives = lazy(() => import("./features/family/pages/Relatives"));
const HealthReports = lazy(() => import("./features/family/pages/HealthReports"));
const FamilyWallet = lazy(() => import("./features/family/pages/Wallet"));
const DashboardMessages = lazy(() => import("./features/family/pages/DashboardMessages"));
const FamilyProfile = lazy(() => import("./features/family/pages/FamilyProfile"));

// Lazy-loaded Caregiver pages
const ForCaregiver = lazy(() => import("./features/caregiver/pages/ForCaregiver"));
const ChooseRole = lazy(() => import("./features/caregiver/pages/ChooseRole"));
const Verification = lazy(() => import("./features/caregiver/pages/Verification"));
const CaregiverDashboard = lazy(() => import("./features/caregiver/pages/CaregiverDashboard"));
const CaregiverSchedule = lazy(() => import("./features/caregiver/pages/CaregiverSchedule"));
const CaregiverBookingRequests = lazy(() => import("./features/caregiver/pages/CaregiverBookingRequests"));
const CaregiverMessages = lazy(() => import("./features/caregiver/pages/CaregiverMessages"));
const CaregiverReview = lazy(() => import("./features/caregiver/pages/CaregiverReview"));
const CaregiverProfilePage = lazy(() => import("./features/caregiver/pages/CaregiverProfilePage"));
const CaregiverWallet = lazy(() => import("./features/caregiver/pages/CaregiverWallet"));
const CaregiverPricing = lazy(() => import("./features/caregiver/pages/CaregiverPricing"));

// Lazy-loaded Admin pages
const AdminDashboard = lazy(() => import("./features/admin/pages/AdminDashboard"));
const CaregiverApprovals = lazy(() => import("./features/admin/pages/CaregiverApprovals"));
const AdminServices = lazy(() => import("./features/admin/pages/AdminServices"));
const AdminAppointments = lazy(() => import("./features/admin/pages/AdminAppointments"));
const UserManagement = lazy(() => import("./features/admin/pages/UserManagement"));
const AdminFinance = lazy(() => import("./features/admin/pages/AdminFinance"));
const AdminHandbook = lazy(() => import("./features/admin/pages/AdminHandbook"));
const AdminDisputes = lazy(() => import("./features/admin/pages/AdminDisputes"));
const AdminNurseStatistics = lazy(() => import("./features/admin/pages/AdminNurseStatistics"));

function RouteFallback() {
  return (
    <div className="min-h-[60vh] w-full flex flex-col items-center justify-center gap-3 text-slate-500">
      <div className="w-8 h-8 rounded-full border-3 border-slate-200 border-t-[#00677c] animate-spin" aria-hidden="true" />
      <span className="text-xs font-medium tracking-wide">Đang tải dữ liệu trang...</span>
    </div>
  );
}

function ScrollToTop() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, search]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <PageTracker />
      <PageTransition>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
          {/* Nhóm các trang Website công khai dùng chung MainLayout (Header + Footer) */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/family" element={<ForFamily />} />
            <Route path="/caregivers" element={<CaregiverList />} />
            <Route path="/search-caregivers" element={<CaregiverList />} />
            <Route path="/caregivers/profile" element={<CaregiverProfile />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment/success" element={<PaymentResult />} />
            <Route path="/payment/cancel" element={<PaymentResult />} />
            <Route path="/review" element={<Review />} />
            {/* Luồng người chăm sóc công khai */}
            <Route path="/caregiver" element={<ForCaregiver />} />
            {/* Cẩm nang y tế & Sức khỏe gia đình */}
            <Route path="/handbook" element={<MedicalHandbook />} />
            <Route path="/handbook/:idOrSlug" element={<HandbookDetail />} />
            {/* Tạm thời bỏ qua trang chọn gói dịch vụ để chuyển thẳng sang trang tìm điều dưỡng */}
            <Route path="/services" element={<Navigate to="/caregivers" replace />} />
            {/* Pháp lý, Điều khoản & Chính sách bảo mật */}
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/chinh-sach-bao-mat" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/dieu-khoan-dich-vu" element={<TermsOfService />} />
          </Route>

          {/* Nhóm Bảng điều khiển Gia đình dùng riêng DashboardLayout (Sidebar điều hướng chuyên biệt) */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/appointments" element={<Appointments />} />
            <Route path="/dashboard/relatives" element={<Relatives />} />
            <Route path="/dashboard/health-reports" element={<HealthReports />} />
            <Route path="/dashboard/wallet" element={<FamilyWallet />} />
            <Route path="/dashboard/messages" element={<DashboardMessages />} />
            <Route path="/dashboard/chat" element={<DashboardMessages />} />
            <Route path="/dashboard/settings" element={<FamilyProfile />} />
          </Route>

          {/* Các trang xác thực độc lập */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Caregiver flow — trang onboarding có header riêng */}
          <Route path="/caregiver/choose-role" element={<ChooseRole />} />
          <Route path="/caregiver/verification" element={<Verification />} />

          {/* Caregiver Dashboard — layout riêng với sidebar của Điều dưỡng */}
          <Route element={<CaregiverLayout />}>
            <Route path="/caregiver/dashboard" element={<CaregiverDashboard />} />
            <Route path="/caregiver/profile" element={<CaregiverProfilePage />} />
            <Route path="/caregiver/pricing" element={<CaregiverPricing />} />
            <Route path="/caregiver/wallet" element={<CaregiverWallet />} />
            <Route path="/caregiver/messages" element={<CaregiverMessages />} />
            <Route path="/caregiver/schedule" element={<CaregiverSchedule />} />
            <Route path="/caregiver/bookings" element={<CaregiverBookingRequests />} />
            <Route path="/caregiver/review" element={<CaregiverReview />} />
          </Route>

          {/* Nhóm Bảng điều khiển Quản trị dùng riêng AdminLayout */}
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/approvals" element={<CaregiverApprovals />} />
            <Route path="/admin/services" element={<AdminServices />} />
            <Route path="/admin/appointments" element={<AdminAppointments />} />
            <Route path="/admin/disputes" element={<AdminDisputes />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/nurse-statistics" element={<AdminNurseStatistics />} />
            <Route path="/admin/finance" element={<AdminFinance />} />
            <Route path="/admin/handbook" element={<AdminHandbook />} />
          </Route>
          </Routes>
        </Suspense>
      </PageTransition>
    </BrowserRouter>
  );
}