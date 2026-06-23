"use client";
import useSWR from "swr";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { api } from "../../../lib/api";
import { Header } from "../../../components/Header";
import { Button } from "../../../components/Button";
import { Modal } from "../../../components/Modal";

const TYPES = ["web3", "stripe", "alipay", "wechat", "bank"] as const;
const ICONS: Record<string, string> = {
  web3: "🔷", stripe: "💳", alipay: "🅰️", wechat: "💚", bank: "🏦"
};

export default function PaymentMethodsPage() {
  const t = useTranslations();
  const { locale } = useParams() as { locale: string };
  const { data, mutate } = useSWR("/v1/payment-methods", () => api.paymentMethods.list());
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>({ type: "web3", label: "", config: {}, isDefault: false });

  const openCreate = () => {
    setEditing(null);
    setForm({ type: "web3", label: "", config: { address: "" }, isDefault: false });
    setOpen(true);
  };

  const openEdit = (m: any) => {
    setEditing(m);
    setForm({ ...m });
    setOpen(true);
  };

  const save = async () => {
    if (editing) await api.paymentMethods.update(editing.id, form);
    else await api.paymentMethods.create(form);
    setOpen(false);
    mutate();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this payment method?")) return;
    await api.paymentMethods.remove(id);
    mutate();
  };

  const setDefault = async (id: string) => {
    await api.paymentMethods.update(id, { isDefault: true });
    mutate();
  };

  const toggleEnabled = async (m: any) => {
    await api.paymentMethods.update(m.id, { enabled: !m.enabled });
    mutate();
  };

  return (
    <div>
      <Header locale={locale} title={t("paymentMethods.title")} subtitle={t("paymentMethods.subtitle")} />

      <main className="p-8 space-y-6">
        <div className="flex justify-end">
          <Button onClick={openCreate}>＋ {t("paymentMethods.add")}</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(data ?? []).map((m: any) => (
            <div key={m.id} className={`glass rounded-2xl p-6 transition ${
              m.isDefault ? "ring-2 ring-brand-500 shadow-glow" : ""
            } ${m.enabled ? "" : "opacity-60"}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center text-2xl">
                    {ICONS[m.type]}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{m.label}</div>
                    <div className="text-xs text-brand-600 uppercase tracking-wider font-medium">
                      {t(`paymentMethods.types.${m.type}`)}
                    </div>
                  </div>
                </div>
                {m.isDefault && (
                  <span className="bg-brand-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                    ★ {t("paymentMethods.default")}
                  </span>
                )}
              </div>

              <div className="bg-slate-50 rounded-lg p-3 mb-4 text-xs font-mono text-slate-600 max-h-24 overflow-auto">
                {Object.entries(m.config ?? {}).map(([k, v]) => (
                  <div key={k}><span className="text-brand-600">{k}:</span> {String(v).slice(0, 40)}</div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {!m.isDefault && (
                  <Button variant="ghost" onClick={() => setDefault(m.id)}>
                    {t("paymentMethods.setDefault")}
                  </Button>
                )}
                <Button variant="ghost" onClick={() => toggleEnabled(m)}>
                  {m.enabled ? "🟢" : "⚪"}
                </Button>
                <Button variant="ghost" onClick={() => openEdit(m)}>{t("common.edit")}</Button>
                <Button variant="danger" onClick={() => remove(m.id)}>{t("common.delete")}</Button>
              </div>
            </div>
          ))}
        </div>

        {(!data || data.length === 0) && (
          <div className="text-center py-16 text-slate-400">{t("common.empty")}</div>
        )}
      </main>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? t("common.edit") : t("paymentMethods.add")}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-600 mb-1">{t("paymentMethods.type")}</label>
            <select
              value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value, config: defaultConfig(e.target.value) })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-300"
            >
              {TYPES.map(t2 => (
                <option key={t2} value={t2}>{ICONS[t2]} {t(`paymentMethods.types.${t2}`)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-1">{t("paymentMethods.label")}</label>
            <input
              value={form.label}
              onChange={e => setForm({ ...form, label: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
          </div>

          <ConfigEditor type={form.type} config={form.config} onChange={c => setForm({ ...form, config: c })} />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={e => setForm({ ...form, isDefault: e.target.checked })}
              className="accent-brand-600"
            />
            {t("paymentMethods.setDefault")}
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>{t("common.cancel")}</Button>
            <Button onClick={save}>{t("common.save")}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function defaultConfig(type: string) {
  const defaults: Record<string, any> = {
    web3:   { chain: "injective", address: "" },
    stripe: { publishableKey: "", secretKey: "", currency: "USD" },
    alipay: { appId: "", region: "CN" },
    wechat: { appId: "", mchId: "" },
    bank:   { bank: "", swift: "", account: "" }
  };
  return defaults[type] ?? {};
}

function ConfigEditor({ type, config, onChange }: any) {
  const keys = Object.keys(config ?? {});
  return (
    <div className="space-y-3 bg-brand-50/40 rounded-lg p-4 border border-brand-100">
      <div className="text-xs text-brand-700 font-medium uppercase tracking-wider">Config</div>
      {keys.map(k => (
        <div key={k}>
          <label className="block text-xs text-slate-600 mb-1">{k}</label>
          <input
            value={config[k] ?? ""}
            onChange={e => onChange({ ...config, [k]: e.target.value })}
            className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-300 font-mono"
          />
        </div>
      ))}
    </div>
  );
}
