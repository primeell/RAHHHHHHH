import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Input = ({ label, error, className, ...props }) => {
    return (
        <div className={clsx("flex flex-col gap-1.5", className)}>
            {label && (
                <label className="text-sm font-medium text-hospital-blue-900">
                    {label}
                </label>
            )}
            <input
                className={twMerge(
                    "flex h-12 w-full rounded-xl border border-hospital-blue-200 bg-white px-4 py-3 text-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-hospital-blue-300 focus:border-medical-teal-500 focus:outline-none focus:ring-2 focus:ring-medical-teal-500/20 disabled:cursor-not-allowed disabled:opacity-50",
                    error && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                )}
                {...props}
            />
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
};

export default Input;
