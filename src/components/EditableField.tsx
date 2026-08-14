"use client";

import { useApp } from "@/lib/DataContext";
import { useState, useEffect } from "react";

interface EditableFieldProps {
  value: string | number;
  type?: "text" | "number" | "date";
  className?: string;
  onChange: (newValue: any) => void;
  renderAs?: "span" | "div" | "h1" | "h2" | "h3" | "h4" | "p";
}

export function EditableField({ value, type = "text", className = "", onChange, renderAs: Component = "span" }: EditableFieldProps) {
  const { isEditMode } = useApp();
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleBlur = () => {
    if (localValue !== value) {
      if (type === "number") {
        onChange(Number(localValue));
      } else {
        onChange(localValue);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      (e.currentTarget as HTMLElement).blur();
    }
  };

  if (!isEditMode) {
    return <Component className={className}>{value}</Component>;
  }

  return (
    <input
      type={type}
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={`bg-white/10 border border-neo-cyan/50 rounded px-2 py-0.5 outline-none focus:bg-white/20 transition-colors w-[120px] max-w-full text-white ${className}`}
      onClick={(e) => e.stopPropagation()}
    />
  );
}
