"use client";
import { LangSwitcher } from "./LangSwitcher";

export function Header({ locale, title, subtitle }: { locale: string; title: string; subtitle?: string }) {
  return (
    <header className="sticky top-0 z-10 glass border-b border-brand-100">
      <div className="px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold gradient-text">{title}</h1>
          {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-3">
          <LangSwitcher current={locale} />
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center text-sm font-semibold shadow-glow">
            U
          </div>
        </div>
      </div>
    </header>
  );
}
