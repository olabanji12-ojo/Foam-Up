import React from "react";
import { FC, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;

  className?: string;
}

const Input: FC<InputProps> = ({ label, className, ...props }) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label ? <label className="text-kata-black">{label}</label> : null}
      <input
        {...props}
        className={
          "outline-[#CBD5E1] border-[#CBD5E1] border-1 p-4 rounded-lg placeholder:text-kata-[#a5aab2] text-kata-[#a5aab2] bg-[#FFFDFB] transition-all w-full" +
          ` ${className}`
        }
      />
    </div>
  );
};

export default Input;
