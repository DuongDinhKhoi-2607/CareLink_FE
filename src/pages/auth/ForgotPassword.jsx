import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [emailOrPhone, setEmailOrPhone] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setIsSubmitted(true);
        }, 600);
    };

    const toggleState = () => {
        setIsSubmitted(!isSubmitted);
    };

    return (
        <div className="min-h-screen flex flex-col justify-between bg-[#F8FAFC] text-slate-800 antialiased selection:bg-teal-100 selection:text-teal-900 font-sans">
            {/* Header đồng bộ logo và kích thước với Header ngoài trang Home */}
            <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_4px_25px_-5px_rgba(16,32,48,0.05)] sticky top-0 z-50 transition-all">
                <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 h-18 flex items-center justify-between">
                    {/* Logo CareLink */}
                    <Link to="/" className="flex items-center gap-2.5 group shrink-0 cursor-pointer" title="Về trang chủ CareLink">
                        <div className="w-9.5 h-9.5 rounded-xl bg-gradient-to-br from-[#00677c] to-[#102030] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform shrink-0">
                            <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold text-[#002045] tracking-tight group-hover:text-teal-600 transition-colors leading-none">
                                Care<span className="text-teal-600">Link</span>
                            </span>
                            <span className="text-[10px] tracking-widest text-teal-600 uppercase font-semibold mt-0.5">
                                Medical Care
                            </span>
                        </div>
                    </Link>

                    {/* Right links */}
                    <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-[13px] font-medium">
                        <Link
                            to="/"
                            className="hidden sm:flex items-center gap-1.5 text-slate-600 hover:text-[#002045] px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                            </svg>
                            <span>Về trang chủ</span>
                        </Link>
                        <span className="hidden sm:inline text-slate-300">|</span>
                        <Link 
                            to="/login" 
                            className="text-xs sm:text-sm font-medium text-slate-600 hover:text-[#002045] flex items-center gap-1.5 transition-colors"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                            </svg>
                            <span>Quay lại đăng nhập</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center p-4 md:p-8 my-6">
                <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200/90 shadow-[0_10px_30px_rgba(0,32,69,0.05)] p-8 md:p-10 relative">
                    
                    {/* Top Decorative Accent */}
                    <div className="w-16 h-1 bg-gradient-to-r from-teal-500 to-[#002045] rounded-full mx-auto mb-8"></div>

                    {/* State 1: Form Yêu Cầu (Mặc định) */}
                    {!isSubmitted ? (
                        <div className="space-y-6">
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center mx-auto mb-4 shadow-inner">
                                    {/* Key Icon */}
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                                    </svg>
                                </div>
                                <h1 className="text-2xl font-bold text-[#002045] tracking-tight">Quên mật khẩu?</h1>
                                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                                    Nhập email hoặc số điện thoại đã đăng ký để nhận hướng dẫn khôi phục tài khoản.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                                        Email hoặc số điện thoại
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                            </svg>
                                        </span>
                                        <input 
                                            type="text" 
                                            required 
                                            value={emailOrPhone}
                                            onChange={(e) => setEmailOrPhone(e.target.value)}
                                            placeholder="Nhập email hoặc số điện thoại của bạn" 
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 focus:bg-white transition-all shadow-xs"
                                        />
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className="w-full py-3.5 px-4 bg-[#002045] hover:bg-[#002d60] text-white font-semibold rounded-xl text-sm shadow-md shadow-[#002045]/15 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-70"
                                >
                                    <span>{isLoading ? "Đang gửi yêu cầu..." : "Gửi yêu cầu khôi phục"}</span>
                                    {!isLoading && (
                                        <svg className="w-4 h-4 text-teal-300" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                                        </svg>
                                    )}
                                </button>
                            </form>

                            <div className="pt-4 border-t border-slate-100 text-center">
                                <p className="text-xs text-slate-500">
                                    Nhớ mật khẩu rồi?{" "}
                                    <Link to="/login" className="font-semibold text-teal-600 hover:text-teal-700 ml-1 transition-colors underline-offset-2 hover:underline">
                                        Đăng nhập
                                    </Link>
                                </p>
                            </div>
                        </div>
                    ) : (
                        /* State 2: Đã Gửi Thành Công */
                        <div className="space-y-6 text-center animate-fadeIn">
                            <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center mx-auto shadow-inner">
                                <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            
                            <div>
                                <h2 className="text-2xl font-bold text-[#002045] tracking-tight">Yêu cầu đã được gửi</h2>
                                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                                    Vui lòng kiểm tra email hoặc tin nhắn SMS gửi tới{" "}
                                    <span className="font-semibold text-slate-700">
                                        {emailOrPhone || "bạn đã nhập"}
                                    </span>{" "}
                                    để hoàn tất đặt lại mật khẩu.
                                </p>
                            </div>

                            <div className="bg-teal-50/70 border border-teal-100/80 rounded-xl p-3.5 text-xs text-teal-800 text-left flex gap-3 items-start">
                                <svg className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                                </svg>
                                <span>
                                    Nếu không thấy email trong hộp thư đến, vui lòng kiểm tra thư mục Quảng cáo (Spam/Junk) hoặc gửi lại sau 60 giây.
                                </span>
                            </div>

                            <div className="space-y-3 pt-2">
                                <Link 
                                    to="/login"
                                    className="w-full py-3.5 px-4 bg-[#002045] hover:bg-[#002d60] text-white font-semibold rounded-xl text-sm shadow-md shadow-[#002045]/15 transition-all flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                    </svg>
                                    <span>Quay lại đăng nhập</span>
                                </Link>

                                <button 
                                    type="button" 
                                    onClick={toggleState} 
                                    className="w-full py-2.5 px-4 bg-transparent text-slate-500 hover:text-slate-800 text-xs font-medium transition-colors cursor-pointer"
                                >
                                    Gửi lại email khác
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Switch preview helper badge for inspection */}
                    <div className="mt-8 pt-4 border-t border-dashed border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
                        <span className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5 text-teal-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                            </svg>
                            Xác thực bảo mật CareLink
                        </span>
                        <button 
                            type="button" 
                            onClick={toggleState} 
                            className="text-teal-600 hover:underline cursor-pointer font-medium"
                        >
                            ({isSubmitted ? "Quay lại nhập" : "Xem trạng thái đã gửi"})
                        </button>
                    </div>

                </div>
            </main>

            {/* Footer */}
            <footer className="w-full py-6 px-6 border-t border-slate-200/80 bg-white/70 backdrop-blur-xs text-center text-xs text-slate-400">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
                    <p>© 2026 CareLink Medical Care. Nền tảng y tế kết nối an toàn và tin cậy.</p>
                    <div className="flex gap-4 text-slate-500">
                        <a href="#" className="hover:text-slate-700">Điều khoản</a>
                        <a href="#" className="hover:text-slate-700">Chính sách bảo mật</a>
                        <a href="#" className="hover:text-slate-700">Hỗ trợ 24/7</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
