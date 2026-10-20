import React from "react";

export default function VerificationStepper({
    currentStep = 1,
    steps = [],
}) {
    const totalSteps = steps.length;
    const safeStep = Math.min(
        Math.max(currentStep, 1),
        Math.max(totalSteps, 1)
    );

    // Phần trăm tiến độ giữa tâm bước đầu và tâm bước cuối.
    const progress =
        totalSteps > 1
            ? ((safeStep - 1) / (totalSteps - 1)) * 100
            : 0;

    // Khoảng cách từ mép thanh đến tâm vòng tròn đầu/cuối.
    const endpoint = totalSteps > 0 ? 50 / totalSteps : 0;

    // Chiều dài thực tế giữa tâm vòng tròn đầu và cuối.
    const trackLength = 100 - 2 * endpoint;

    const progressWidth = (progress / 100) * trackLength;

    return (
        <div className="w-full">
            {/* Desktop */}
            <div className="hidden sm:block">
                <div className="relative">
                    {/* Thanh nền: từ tâm vòng tròn đầu đến tâm vòng tròn cuối */}
                    {totalSteps > 1 && (
                        <div
                            className="absolute top-5 h-[3px] rounded-full bg-slate-200"
                            style={{
                                left: `${endpoint}%`,
                                right: `${endpoint}%`,
                            }}
                        />
                    )}

                    {/* Thanh tiến độ: kết thúc chính xác tại tâm bước hiện tại */}
                    {totalSteps > 1 && (
                        <div
                            className="absolute top-5 h-[3px] rounded-full bg-emerald-500 transition-[width] duration-500 ease-out"
                            style={{
                                left: `${endpoint}%`,
                                width: `${progressWidth}%`,
                            }}
                        />
                    )}

                    {/* Các bước chia đều theo chiều rộng */}
                    <div
                        className="relative grid"
                        style={{
                            gridTemplateColumns: `repeat(${totalSteps}, minmax(0, 1fr))`,
                        }}
                    >
                        {steps.map((step, index) => {
                            const number = index + 1;
                            const completed = number < safeStep;
                            const active = number === safeStep;

                            return (
                                <div
                                    key={step.label ?? number}
                                    className="flex min-w-0 flex-col items-center"
                                >
                                    <div
                                        className={[
                                            "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center",
                                            "rounded-full border-2 text-sm font-bold",
                                            "transition-all duration-300",
                                            completed
                                                ? "border-emerald-600 bg-emerald-600 text-white shadow-sm"
                                                : active
                                                    ? "border-[#087E78] bg-white text-[#087E78] ring-4 ring-[#087E78]/10"
                                                    : "border-slate-300 bg-white text-slate-600",
                                        ].join(" ")}
                                    >
                                        {completed ? (
                                            <svg
                                                className="h-5 w-5"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2.5"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    d="m5 12 4 4L19 6"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        ) : (
                                            number
                                        )}
                                    </div>

                                    <span
                                        className={[
                                            "mt-2 max-w-[140px] px-1 text-center",
                                            "text-xs leading-4 transition-colors",
                                            active
                                                ? "font-bold text-[#087E78]"
                                                : completed
                                                    ? "font-semibold text-emerald-700"
                                                    : "font-medium text-slate-600",
                                        ].join(" ")}
                                    >
                                        {step.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Mobile */}
            <div className="sm:hidden">
                <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="shrink-0 text-sm font-bold text-slate-800">
                        Bước {safeStep}/{totalSteps}
                    </span>

                    <span className="max-w-[70%] text-right text-sm font-semibold text-[#087E78]">
                        {steps[safeStep - 1]?.label}
                    </span>
                </div>

                <div className="flex gap-1.5">
                    {steps.map((step, index) => {
                        const number = index + 1;
                        const completed = number < safeStep;
                        const active = number === safeStep;

                        return (
                            <div
                                key={step.label ?? number}
                                aria-label={step.label}
                                aria-current={active ? "step" : undefined}
                                className={[
                                    "h-1.5 min-w-0 flex-1 rounded-full transition-colors duration-300",
                                    completed
                                        ? "bg-emerald-500"
                                        : active
                                            ? "bg-[#087E78]"
                                            : "bg-slate-200",
                                ].join(" ")}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}