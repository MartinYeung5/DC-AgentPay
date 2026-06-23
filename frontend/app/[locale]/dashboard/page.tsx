"use client";
import useSWR from "swr";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { api } from "../../../lib/api";
import { Header } from "../../../components/Header";
import { StatCard } from "../../../components/StatCard";

export default function Dashboard() {
  const t = useTranslations();
  const { locale } = useParams() as { locale: string };
  const { data, isLoading } = useSWR("/v1/stats", () => api.stats(), { refreshInterval: 10000 });

  return (
    <div>
      <Header locale={locale} title={t("dashboard.title")} subtitle={t("dashboard.subtitle")} />

      <main className="p-8 space-y-8">
        {isLoading ? (
          <div className="text-slate-500">{t("common.loading")}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon="🤖" label={t("dashboard.totalAgents")} value={data?.agents ?? 0}
                accent="bg-brand-50 text-brand-600" />
              <StatCard icon="💸" label={t("dashboard.totalPayments")} value={data?.payments ?? 0}
                accent="bg-emerald-50 text-emerald-600" />
              <StatCard icon="🔄" label={t("dashboard.activeSubscriptions")} value={data?.subs ?? 0}
                accent="bg-amber-50 text-amber-600" />
              <StatCard icon="🪙" label={t("dashboard.tokenUsed")}
                value={`${((data?.tokenUsed ?? 0) / 1000).toFixed(1)}K / ${((data?.tokenQuota ?? 0) / 1000).toFixed(0)}K`}
                accent="bg-indigo-50 text-indigo-600" />
            </div>

            <section className="glass rounded-2xl p-6">
              <h3 className="font-semibold text-lg text-slate-800 mb-4">{t("dashboard.weeklyTrend")}</h3>
              <TrendChart data={data?.trend ?? []} />
            </section>

            <section className="glass rounded-2xl p-6">
              <h3 className="font-semibold text-lg text-slate-800 mb-4">{t("dashboard.recentPayments")}</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 border-b border-slate-200">
                    <th className="pb-2">Agent</th>
                    <th>{t("payments.amount")}</th>
                    <th>{t("payments.to")}</th>
                    <th>{t("common.status")}</th>
                    <th>{t("payments.time")}</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.recent ?? []).map((p: any) => (
                    <tr key={p.id} className="border-b border-slate-100 hover:bg-brand-50/30">
                      <td className="py-3">
                        <span className="mr-2">{p.agent?.avatar ?? "🤖"}</span>
                        {p.agent?.name ?? "Agent"}
                      </td>
                      <td className="font-mono text-brand-700">{p.amount}</td>
                      <td className="font-mono text-xs text-slate-600">{p.toAddr?.slice(0, 10)}…</td>
                      <td><StatusBadge status={p.status} /></td>
                      <td className="text-slate-500 text-xs">{new Date(p.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                  {(!data?.recent || data.recent.length === 0) && (
                    <tr><td colSpan={5} className="py-8 text-center text-slate-400">{t("common.empty")}</td></tr>
                  )}
                </tbody>
              </table>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    confirmed: "bg-emerald-100 text-emerald-700",
    submitted: "bg-blue-100 text-blue-700",
    failed: "bg-red-100 text-red-700"
  };
  return <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${styles[status] ?? "bg-slate-100 text-slate-600"}`}>{status}</span>;
}

function TrendChart({ data }: { data: { date: string; count: number; amount: number }[] }) {
  const max = Math.max(...data.map(d => d.count), 1);
  return (
    <div className="flex items-end gap-3 h-40">
      {data.map((d) => (
        <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
          <div className="text-xs text-brand-700 font-semibold">{d.count}</div>
          <div
            className="w-full bg-gradient-to-t from-brand-600 to-brand-400 rounded-t-lg transition-all hover:from-brand-700 hover:to-brand-500"
            style={{ height: `${(d.count / max) * 100}%`, minHeight: "4px" }}
          />
          <div className="text-[10px] text-slate-500 mt-1">{d.date}</div>
        </div>
      ))}
    </div>
  );
}
