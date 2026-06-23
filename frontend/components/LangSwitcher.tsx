"use client";
import { useRouter, usePathname } from "next/navigation";

export function LangSwitcher({ current }: { current: string }) {
  const router = useRouter();
  const path = usePathname();
  const switchTo = (l: string) =>
    router.push((path ?? "/").replace(/^\/(zh-CN|zh-TW|en)/, `/${l}`));

  return (
    <select
      data-testid="lang-switcher"
      value={current}
      onChange={(e) => switchTo(e.target.value)}
      className="text-sm border border-brand-200 bg-white rounded-lg px-3 py-1.5 text-brand-700 hover:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-300 transition"
    >
      <option value="zh-CN">🇨🇳 简体中文</option>
      <option value="zh-TW">🇭🇰 繁體中文</option>
      <option value="en">🇬🇧 English</option>
    </select>
  );
}
