import React from "react";

export default function LogoutModal({ isOpen, onClose, onConfirm, roleName = "tài khoản" }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            {/* Lớp nền mờ dịu mắt, giảm độ tương phản chói */}
            <div 
                className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
                onClick={onClose} 
            />

            {/* Hộp thoại xác nhận: Rộng rãi hơn (max-w-md), nền dịu sang trọng không chói */}
            <div className="relative w-full max-w-md bg-[#f8fafc] rounded-3xl p-7 sm:p-8 shadow-[0_20px_50px_rgba(15,23,42,0.22)] border border-slate-200/90 z-10 text-center animate-in zoom-in-95 duration-200 flex flex-col items-center">
                {/* Icon cảnh báo tròn đỏ mềm mại */}
                <div className="w-14 h-14 rounded-2xl bg-rose-100/80 border border-rose-200/90 flex items-center justify-center text-rose-600 mb-4 shadow-xs">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                    </svg>
                </div>

                <h3 className="text-lg font-bold text-slate-800 tracking-tight mb-2">
                    Xác nhận đăng xuất?
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed max-w-sm mb-6">
                    Bạn có chắc chắn muốn thoát khỏi <span className="font-semibold text-slate-700">{roleName}</span>? Bạn sẽ cần đăng nhập lại để tiếp tục sử dụng các chức năng này.
                </p>

                <div className="grid grid-cols-2 gap-3 w-full">
                    {/* Nút Ở lại: Nền màu slate dịu êm, chống chói mắt */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full py-3 px-4 rounded-xl bg-slate-200 hover:bg-slate-300/80 text-slate-700 font-semibold text-sm transition-all cursor-pointer border border-slate-300/70 active:scale-[0.98]"
                    >
                        Ở lại
                    </button>
                    {/* Nút Đăng xuất: Màu đỏ sang xịn đẹp */}
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm shadow-md shadow-rose-600/25 transition-all hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
                    >
                        <span>Đăng xuất</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
