import React, { FC } from "react";

interface InputProps {
    type: string;
    id: string;
    placeholder: string;
    seter?: (value: string) => void;
    tabIndex: number;
    disabled?: boolean;
    defaultValue?: string | number | readonly string[] | undefined;
    required?: boolean;
    error?: boolean;
    className?: string;
}

const Input: FC<InputProps> = ({ className="", error = false, type = "text", id, placeholder, seter, tabIndex, required = false, disabled = false, defaultValue = "" }) => {
    return (
        <input
            tabIndex={tabIndex}
            onChange={(e) => {
                if (seter) {
                    seter(e.target.value);
                }
            }}
            disabled={disabled}
            type={type}
            id={id}
            className={((error && defaultValue == '') && '!border-[#ff4f4f] omar placeholder:!text-[#ff4f4f]') + ` bg-white bg-opacity-[15%] placeholder:text-white placeholder:text-opacity-80 text-[#ffffff] text-opacity-80 border-b-slate-50 border-b-[3px] text-[.6rem] leading-[1.5rem] w-full py-2 px-2 ` + className}
            placeholder={placeholder}
            required={false}
            // defaultValue={defaultValue}
            value={defaultValue}
            maxLength={1024}
        />
    );
};

export default Input;