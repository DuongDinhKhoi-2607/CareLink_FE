import React from "react";

export default function ServiceCard({ title, description, icon, badge, tags, className = "", actionButton }) {
    return (
        <article
            className={`relative flex flex-col justify-between p-8 rounded-3xl border border-gray-200 shadow-sm transition-transform hover:-translate-y-1 ${className}`}
        >
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#f4f7f8] flex items-center justify-center">
                        {icon}
                    </div>
                    {badge && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white">
                            {badge}
                        </span>
                    )}
                </div>

                <h3 className="text-xl font-bold text-[#102030] mt-2">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
            </div>

            {tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-6 border-t border-gray-100 mt-6">
                    {tags.map((tag) => (
                        <span
                            key={tag}
                            className="px-3 py-1.5 rounded-xl bg-[#f4f7f8] text-xs font-semibold text-[#102030]"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            {actionButton && <div className="pt-4">{actionButton}</div>}
        </article>
    );
}