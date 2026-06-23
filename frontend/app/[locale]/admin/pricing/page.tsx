"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Header } from "../../../../components/Header";
import { Button } from "../../../../components/Button";

const FAKE_PLANS = [
  { id: 1, name: "Starter",    priceUSD: 0,   tokenQuota: 100000,   features: ["3 Agents", "Webhooks", "Sandbox"] },
  { id: 2, name: "Pro",        priceUSD: 49,  tokenQuota: 1000000,  features: ["20 Agents", "Webhooks", "Batch Settle"] },
  { id: 3, name: "Enterprise", priceUSD: 299, tokenQuota: 10000000, features: ["Unlimited", "SLA 99.9%", "Priority Support"] }
];

const FAKE_TOKEN = [
  { id: 1, model: "deepseek-chat",     pricePer1k: 0.0014 },
  { id: 2, model: "deepseek-reasoner", pricePer1k: 0.0055 }
];

export default function PricingAdmin() {
  const t = useTranslations();
  const { locale } = useParams() as { locale: string };
  const [plans, setPlans] = useState(FAKE_PLANS);
  const [tokens, setTokens] = useState(FAKE_TOKEN);

  return (
    <div>
      <Header locale={locale} title={t("pricing.title")} />

      <main className="p-8 space-y-10">
        {/* 订阅套餐 */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((p, i) => (
              <div key={p.id} className={`glass rounded-2xl p-8 relative transition hover:shadow-glow ${
                i === 1 ? "ring-2 ring-brand-500" : ""
              }`}>
                {i === 1 && (
                  <div className="absolute top-0 right-6 -translate-y-1/2 bg-gradient-to-r from-brand-500 to-brand-700 text-white text-xs px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="text-lg font-semibold text-slate-700">{p.name}</div>
                <div className="mt-3">
                  <span className="text-5xl font-bold gradient-text">${p.priceUSD}</span>
                  <span className="text-slate-500">{t("pricing.month")}</span>
                </div>
                <div className="text-sm text-slate-500 mt-2 mb-6">
                  {(p.tokenQuota / 1000).toFixed(0)}K tokens / month
                </div>
                <ul className="space-y-2 text-sm">
                  {p.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-slate-600">
                      <span className="text-brand-600">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <input
                    type="number" defaultValue={p.priceUSD}
                    onChange={e => {
                      const v = +e.target.value;
                      setPlans(plans.map(x => x.id === p.id ? { ...x, priceUSD: v } : x));
                    }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-300 mb-2"
                  />
                  <Button className="w-full">{t("common.save")}</Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Token 单价 */}
        <section className="glass rounded-2xl p-8">
          <h3 className="font-semibold text-lg mb-4 text-slate-800">{t("pricing.tokenPrice")}</h3>
          <div className="space-y-3">
            {tokens.map(tk => (
              <div key={tk.id} className="flex items-center gap-4 p-3 bg-brand-50/40 rounded-lg">
                <span className="font-mono text-sm flex-1 text-slate-700">{tk.model}</span>
                <input
                  type="number" step="0.0001" defaultValue={tk.pricePer1k}
                  className="w-32 px-3 py-1.5 border border-slate-200 rounded-md font-mono text-sm focus:ring-2 focus:ring-brand-300"
                />
                <span className="text-xs text-slate-500">USD / 1K</span>
                <Button variant="ghost">{t("common.save")}</Button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
