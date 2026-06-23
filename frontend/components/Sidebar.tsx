"use client";
import { usePathname, useParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";

const items = [
  { href: "dashboard",        icon: "📊", key: "dashboard" },
  { href: "agents",           icon: "🤖", key: "agents" },
  { href: "payments",         icon: "💸", key: "payments" },
  { href: "subscriptions",    icon: "🔄", key: "subscriptions" },
  { href: "payment-methods",  icon: "💳", key: "paymentMethods" },
  { href: "admin/pricing",    icon: "⚙️", key: "admin" }
];

export function Sidebar() {
  const t = useTranslations();
  const path = usePathname();
  const { locale } = useParams() as { locale: string };

  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 bg-gradient-to-b from-brand-900 via-brand-800 to-brand-900 text-white flex flex-col">
      <div className="px-6 py-6 border-b border-brand-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-xl shadow-glow">
            ⚡
          </div>
          <div>
            <div className="font-bold text-lg leading-tight">{t("brand")}</div>
            <div className="text-[10px] text-brand-200 leading-tight">{t("tagline")}</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {items.map(it => {
          const href = `/${locale}/${it.href}`;
          const active = path === href || path?.startsWith(href + "/");
          return (
            <Link
              key={it.href}
              href={href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ${
                active
                  ? "bg-white/15 text-white shadow-md font-medium"
                  : "text-brand-100 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="text-lg">{it.icon}</span>
              <span>{t(`nav.${it.key}`)}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-4 border-t border-brand-700/50 text-xs text-brand-200">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Injective Testnet
        </div>
      </div>
    </aside>
  );
}
