"use client";

import React, { useState } from "react";

export function Tabs({
  children,
  defaultValue,
  className = "",
  onChange,
  ...props
}) {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (newValue) => {
    setValue(newValue);
    if (onChange) onChange(newValue);
  };

  // Extract tab list from children
  const tabList = React.Children.map(children, (child) => {
    if (child.type === TabsList) {
      return React.cloneElement(child, { value, onChange: handleChange });
    }
    return null;
  });

  // Extract tab content
  const tabContent = React.Children.map(children, (child) => {
    if (child.type === TabsContent) {
      return React.cloneElement(child, { value });
    }
    return null;
  });

  return (
    <div className={`w-full ${className}`} {...props}>
      {tabList}
      {tabContent}
    </div>
  );
}

export function TabsList({
  children,
  className = "",
  value,
  onChange,
  ...props
}) {
  return (
    <div
      className={`flex border-b border-[var(--color-border)] ${className}`}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (child.type === TabsTrigger) {
          return React.cloneElement(child, {
            value,
            onChange,
            selected: child.props.value === value,
          });
        }
        return child;
      })}
    </div>
  );
}

export function TabsTrigger({
  children,
  value: tabValue,
  onChange,
  selected,
  className = "",
  ...props
}) {
  return (
    <button
      className={`px-4 py-2 text-sm font-medium transition-all duration-200 border-b-2 -mb-px ${
        selected
          ? "border-[var(--color-primary)] text-[var(--color-primary)]"
          : "border-transparent hover:border-[var(--color-border)] hover:text-[var(--color-text)]"
      } ${className}`}
      onClick={() => onChange(tabValue)}
      {...props}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  children,
  value: contentValue,
  value: currentValue,
  className = "",
  ...props
}) {
  return (
    <div
      className={`${
        contentValue === currentValue ? "block" : "hidden"
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
