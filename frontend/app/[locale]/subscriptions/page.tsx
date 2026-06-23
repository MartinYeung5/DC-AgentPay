"use client";
import useSWR from "swr";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { api } from "../../../lib/api";
import { Header } from "../../../components/Header";

export default function SubscriptionsPage() {
  const t = useTranslations();
  const { locale } = useParams() as { locale: string };
  const { data } = useSWR("/v1/subscriptions", () => api.subscriptions.list());

  return (
    <div>
      <Header locale={locale} title={t("subscriptions.title")} subtitle={t("subscriptions.subtitle")} />
      <main className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(data ?? []).map((s: any) => (
            <div key={s.id} className="glass rounded-2xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="text-2xl">🔄</div>
                <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                  s.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"
                }`}>{s.status}</span>
              </div>
              <div className="text-sm text-slate-500">{t("subscriptions.planId")}</div>
              <div className="text-2xl font-bold gradient-text mb-3">#{s.planId}</div>
              <div className="text-xs text-slate-500">
                {t("subscriptions.nextCharge")}: <br />
                <span className="text-slate-800 font-mono">{new Date(s.nextCharge).toLocaleString()}</span>
              </div>
            </div>
          ))}
          {(!data || data.length === 0) && (
            <div className="col-span-3 text-center py-16 text-slate-400">{t("common.empty")}</div>
          )}
        </div>
      </main>
    </div>
  );
}
