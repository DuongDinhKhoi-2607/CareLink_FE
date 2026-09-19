import React from "react";

export default function VerificationStepper({ currentStep, steps }) {
    return (
        <div className="w-full">
            {/* Desktop stepper */}
            <div className="hidden sm:flex items-center justify-between relative">
                {/* Connecting line background */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200 z-0" />
                {/* Connecting line progress */}
                <div
                    className="absolute top-5 left-0 h-0.5 bg-[#00677c] z-0 transition-all duration-500 ease-out"
                    style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                />

                {steps.map((step, index) => {
                    const stepNum = index + 1;
                    const isCompleted = stepNum < currentStep;
                    const isActive = stepNum === currentStep;

                    return (
                        <div key={step.label} className="flex flex-col items-center gap-2 z-10">
                            {/* Step circle */}
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
                                    isCompleted
                                        ? "bg-[#00677c] border-[#00677c] text-white shadow-md shadow-[#00677c33]"
                                        : isActive
                                        ? "bg-white border-[#00677c] text-[#00677c] shadow-lg shadow-[#00677c20] ring-4 ring-[#00677c15]"
                                        : "bg-white border-slate-200 text-slate-400"
                                }`}
                            >
                                {isCompleted ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                ) : (
                                    stepNum
                                )}
                            </div>

                            {/* Step label */}
                            <span
                                className={`text-xs font-semibold text-center leading-tight max-w-[80px] transition-colors duration-300 ${
                                    isActive ? "text-[#00677c]" : isCompleted ? "text-[#102030]" : "text-slate-400"
                                }`}
                            >
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Mobile stepper — compact */}
            <div className="flex sm:hidden items-center gap-3">
                <div className="flex items-center gap-1">
                    {steps.map((_, index) => {
                        const stepNum = index + 1;
                        const isCompleted = stepNum < currentStep;
                        const isActive = stepNum === currentStep;
                        return (
                            <div
                                key={index}
                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                    isCompleted
                                        ? "w-4 bg-[#00677c]"
                                        : isActive
                                        ? "w-6 bg-[#00677c]"
                                        : "w-4 bg-slate-200"
                                }`}
                            />
                        );
                    })}
                </div>
                <span className="text-xs font-semibold text-slate-500">
                    Bước {currentStep}/{steps.length} — {steps[currentStep - 1]?.label}
                </span>
            </div>
        </div>
    );
}
