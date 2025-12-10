"use client";

import { useState, useRef } from "react";

interface OTPInputProps {
    length?: number;
    onComplete: (value: string) => void;
}

export function OTPInput({ length = 4, onComplete }: OTPInputProps) {
    const [values, setValues] = useState<string[]>(Array(length).fill(""));
    const inputsRef = useRef<HTMLInputElement[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
        const val = e.target.value.replace(/\D/, ""); // seulement chiffres
        if (!val) return;

        const newValues = [...values];
        newValues[idx] = val[0];
        setValues(newValues);

        // focus suivant
        if (idx < length - 1) {
            inputsRef.current[idx + 1].focus();
        }

        // callback si complet
        if (newValues.every((v) => v !== "")) {
            onComplete(newValues.join(""));
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
        if (e.key === "Backspace") {
            if (values[idx]) {
                const newValues = [...values];
                newValues[idx] = "";
                setValues(newValues);
            } else if (idx > 0) {
                inputsRef.current[idx - 1].focus();
            }
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const paste = e.clipboardData.getData("Text").replace(/\D/g, "").slice(0, length);
        const newValues = paste.split("");
        const paddedValues = [...newValues, ...Array(length - newValues.length).fill("")];
        setValues(paddedValues);
        if (paddedValues.every((v) => v !== "")) {
            onComplete(paddedValues.join(""));
        }
        e.preventDefault();
    };

    return (
        <div className="flex gap-2 justify-center">
            {Array.from({ length }).map((_, idx) => (
                <input key={idx}  type="text" inputMode="numeric"  maxLength={1} value={values[idx]} onChange={(e) => handleChange(e, idx)} onKeyDown={(e) => handleKeyDown(e, idx)} onPaste={handlePaste} ref={(el) => { if (el) inputsRef.current[idx] = el; }}
                    className="w-12 h-12 text-center text-xl border rounded-md focus:outline-none focus:ring-2 focus:ring-[#B07B5E]"
                />
            ))}
        </div>
    );
}
