"use client";

import React from "react";

export default function Panel({
  children,
  title,
  className = "",
  collapsible = false,
  defaultOpen = true,
  ...props
}) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div
      className={`border border-[var(--color-border)] rounded-md bg-[var(--color-panel-background)] ${className}`}
      {...props}
    >
      {title && (
        <div
          className={`flex items-center justify-between px-4 py-2 border-b border-[var(--color-border)] ${
            collapsible ? "cursor-pointer" : ""
          }`}
          onClick={collapsible ? () => setIsOpen(!isOpen) : undefined}
        >
          <h3 className="font-medium text-sm">{title}</h3>
          {collapsible && <span className="text-xs">{isOpen ? "▼" : "►"}</span>}
        </div>
      )}
      <div className={`p-4 ${!isOpen && collapsible ? "hidden" : ""}`}>
        {children}
      </div>
    </div>
  );
}
