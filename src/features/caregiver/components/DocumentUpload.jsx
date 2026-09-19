import React, { useRef, useState } from "react";

export default function DocumentUpload({ label, hint, accept = "image/*,.pdf", onChange, required = false }) {
    const inputRef = useRef(null);
    const [dragging, setDragging] = useState(false);
    const [preview, setPreview] = useState(null);
    const [fileName, setFileName] = useState(null);

    const handleFile = (file) => {
        if (!file) return;
        setFileName(file.name);

        if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (e) => setPreview(e.target.result);
            reader.readAsDataURL(file);
        } else {
            setPreview("pdf");
        }

        if (onChange) onChange(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        handleFile(file);
    };

    const handleChange = (e) => {
        handleFile(e.target.files[0]);
    };

    const handleRemove = () => {
        setPreview(null);
        setFileName(null);
        if (inputRef.current) inputRef.current.value = "";
        if (onChange) onChange(null);
    };

    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#102030]">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {hint && <p className="text-xs text-slate-500 -mt-1">{hint}</p>}

            {preview ? (
                /* Preview state */
                <div className="relative rounded-xl border border-[#00677c40] bg-[#f0f9fb] overflow-hidden group">
                    {preview === "pdf" ? (
                        <div className="flex items-center gap-3 p-4">
                            <div className="w-10 h-10 rounded-lg bg-[#00677c] flex items-center justify-center shrink-0">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-[#102030] truncate">{fileName}</p>
                                <p className="text-xs text-slate-500">PDF đã tải lên</p>
                            </div>
                        </div>
                    ) : (
                        <img src={preview} alt="Preview" className="w-full max-h-48 object-cover" />
                    )}

                    {/* Remove button */}
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center text-slate-500 hover:text-red-500 hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Re-upload overlay */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => inputRef.current?.click()}>
                        <span className="text-white text-xs font-semibold bg-black/50 px-3 py-1.5 rounded-lg">Thay đổi file</span>
                    </div>
                </div>
            ) : (
                /* Drop zone */
                <div
                    onClick={() => inputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    className={`relative flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
                        dragging
                            ? "border-[#00677c] bg-[#e6f3f5] scale-[1.01]"
                            : "border-slate-200 bg-slate-50 hover:border-[#00677c60] hover:bg-[#f0f9fb]"
                    }`}
                >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${dragging ? "bg-[#00677c]" : "bg-slate-100"}`}>
                        <svg className={`w-6 h-6 transition-colors ${dragging ? "text-white" : "text-slate-400"}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-semibold text-[#102030]">Kéo thả hoặc <span className="text-[#00677c]">chọn file</span></p>
                        <p className="text-xs text-slate-400 mt-0.5">
                            {accept.includes("pdf") ? "Hỗ trợ JPG, PNG, PDF" : "Hỗ trợ JPG, PNG"} · Tối đa 10MB
                        </p>
                    </div>
                </div>
            )}

            <input
                ref={inputRef}
                type="file"
                accept={accept}
                className="hidden"
                onChange={handleChange}
            />
        </div>
    );
}
