"use client";
import useSWR from "swr";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { api } from "../../../lib/api";
import { Header } from "../../../components/Header";
import { Button } from "../../../components/Button";
import { Modal } from "../../../components/Modal";

export default function AgentsPage() {
  const t = useTranslations();
  const { locale } = useParams() as { locale: string };
  const { data, mutate } = useSWR("/v1/agents", () => api.agents.list());
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: "", description: "", avatar: "🤖", webhookURL: "" });

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", description: "", avatar: "🤖", webhookURL: "" });
    setOpen(true);
  };

  const openEdit = (a: any) => {
    setEditing(a);
    setForm({ name: a.name ?? "", description: a.description ?? "", avatar: a.avatar ?? "🤖", webhookURL: a.webhookURL ?? "" });
    setOpen(true);
  };

  const save = async () => {
    if (editing) await api.agents.update(editing.id, form);
    else await api.agents.create(form);
    setOpen(false);
    mutate();
  };

  const remove = async (id: string) => {
    if (!confirm(t("agents.deleteConfirm"))) return;
    await api.agents.remove(id);
    mutate();
  };

  const toggle = async (a: any) => {
    await api.agents.toggle(a.id, a.status === "active" ? "paused" : "active");
    mutate();
  };

  return (
    <div>
      <Header locale={locale} title={t("agents.title")} subtitle={t("agents.subtitle")} />

      <main className="p-8 space-y-6">
        <div className="flex justify-end">
          <Button onClick={openCreate}>＋ {t("agents.create")}</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(data ?? []).map((a: any) => (
            <div key={a.id} className="glass rounded-2xl p-6 hover:shadow-glow transition">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center text-2xl">
                    {a.avatar ?? "🤖"}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{a.name}</div>
                    <div className="text-xs text-slate-500 font-mono">{a.did?.slice(0, 28)}…</div>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  a.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"
                }`}>
                  {t(a.status === "active" ? "common.active" : "common.paused")}
                </span>
              </div>

              <p className="text-sm text-slate-600 mb-4 line-clamp-2 min-h-[40px]">{a.description ?? "—"}</p>

              <div className="text-xs text-slate-500 space-y-1 mb-4 font-mono">
                <div>💼 {a.walletAddr?.slice(0, 16)}…</div>
                {a.webhookURL && <div>🔔 {a.webhookURL.slice(0, 30)}…</div>}
              </div>

              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => openEdit(a)}>{t("common.edit")}</Button>
                <Button variant="ghost" onClick={() => toggle(a)}>
                  {a.status === "active" ? "⏸" : "▶"}
                </Button>
                <Button variant="danger" onClick={() => remove(a.id)}>{t("common.delete")}</Button>
              </div>
            </div>
          ))}
        </div>

        {(!data || data.length === 0) && (
          <div className="text-center py-16 text-slate-400">{t("common.empty")}</div>
        )}
      </main>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? t("common.edit") : t("agents.create")}>
        <div className="space-y-4">
          <Field label={t("agents.name")} value={form.name} onChange={v => setForm({ ...form, name: v })} />
          <Field label={t("agents.avatar")} value={form.avatar} onChange={v => setForm({ ...form, avatar: v })} />
          <Field label={t("agents.description")} value={form.description} onChange={v => setForm({ ...form, description: v })} />
          <Field label={t("agents.webhook")} value={form.webhookURL} onChange={v => setForm({ ...form, webhookURL: v })} />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>{t("common.cancel")}</Button>
            <Button onClick={save}>{t("common.save")}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm text-slate-600 mb-1">{label}</label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400"
      />
    </div>
  );
}
