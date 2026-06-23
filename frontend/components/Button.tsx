import { ButtonHTMLAttributes } from "react";

export function Button({
  variant = "primary",
  className = "",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "danger" }) {
  const base = "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2";
  const styles = {
    primary: "bg-gradient-to-r from-brand-600 to-brand-700 text-white hover:from-brand-700 hover:to-brand-800 shadow-md shadow-brand-500/30 focus:ring-brand-300",
    ghost: "bg-white border border-brand-200 text-brand-700 hover:bg-brand-50 focus:ring-brand-200",
    danger: "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 focus:ring-red-200"
  };
  return <button {...rest} className={`${base} ${styles[variant]} ${className}`} />;
}
