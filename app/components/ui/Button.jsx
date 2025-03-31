"use client";

import React from "react";

export default function Button({
  children,
  onClick,
  variant = "default",
  size = "md",
  className = "",
  disabled = false,
  ...props
}) {
  const baseStyles =
    "font-medium transition-colors duration-200 focus:outline-none";

  const variants = {
    default: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    primary:
      "bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white",
    secondary: "bg-[var(--color-secondary)] hover:opacity-90 text-white",
    outline:
      "bg-transparent border border-[var(--color-border)] hover:bg-[var(--color-menu-hover)]",
    ghost: "bg-transparent hover:bg-[var(--color-menu-hover)]",
  };

  const sizes = {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${
        sizes[size]
      } ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      {...props}
    >
      {children}
    </button>
  );
}
