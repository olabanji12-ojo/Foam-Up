import React from "react";
import { ButtonHTMLAttributes, FC, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  className?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

const Button: FC<ButtonProps> = ({
  text,
  className = "",
  iconLeft,
  iconRight,
  ...props
}) => {
  return (
    <button
      {...props}
      className={`uk-button uk-width-1-1 ${className}`}
    >
      {iconLeft && <span className="flex items-center uk-margin-left">{iconLeft}</span>}
      <span>{text}</span>
      {iconRight && (
        <span className="flex items-center uk-margin-right">{iconRight}</span>
      )}
    </button>
  );
};

export default Button;
