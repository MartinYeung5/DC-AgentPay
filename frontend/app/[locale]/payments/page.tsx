"use client";
import useSWR from "swr";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { api } from "../../../lib/api";
import { Header } from "../../../components/Header";

export default function PaymentsPage() {
  const t = useTranslations();
  const { locale } = useParams() as { locale: string };
  const { data } = useSWR("/v1/payments", () => api.payments.list());

  return (
    <div>
      <Header locale={locale} title={t("payments.title")} subtitle={t("payments.subtitle")} />
      <main className="p-8">
        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-brand-50 to-white">
              <tr className="text-left text-slate-600 border-b border-slate-200">
                <th className="px-6 py-3">{t("payments.amount")}</th>
                <th className="px-6 py-3">{t("payments.to")}</th>
                <th className="px-6 py-3">{t("payments.txHash")}</th>
                <th className="px-6 py-3">{t("payments.method")}</th>
                <th className="px-6 py-3">{t("common.status")}</th>
                <th className="px-6 py-3">{t("payments.time")}</th>
              </tr>
            </thead>
            <tbody>
              {(data ?? []).map((p: any) => (
                <tr key={p.id} className="border-b border-slate-100 hover:bg-brand-50/30">
                  <td className="px-6 py-3 font-mono text-brand-700 font-semibold">{p.amount}</td>
                  <td className="px-6 py-3 font-mono text-xs text-slate-600">{p.toAddr?.slice(0, 16)}…</td>
                  <td className="px-6 py-3 font-mono text-xs text-slate-500">{p.txHash?.slice(0, 16)}…</td>
                  <td className="px-6 py-3">
                    <span className="bg-brand-50 text-brand-700 px-2 py-0.5 rounded text-xs">
                      {p.method ?? "—"}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                      p.status === "confirmed" ? "bg-emerald-100 text-emerald-700" :
                      p.status === "failed"    ? "bg-red-100 text-red-700" :
                                                 "bg-blue-100 text-blue-700"
                    }`}>{p.status}</span>
                  </td>
                  <td className="px-6 py-3 text-xs text-slate-500">{new Date(p.createdAt).toLocaleString()}</td>
                </tr>
              ))}
              {(!data || data.length === 0) && (
                <tr><td colSpan={6} className="text-center py-12 text-slate-400">{t("common.empty")}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
