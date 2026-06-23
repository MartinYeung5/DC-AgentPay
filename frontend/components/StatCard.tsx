export function StatCard({ icon, label, value, accent }: {
  icon: string; label: string; value: string | number; accent?: string;
}) {
  return (
    <div data-testid="stat-card" className="glass rounded-2xl p-6 hover:shadow-glow transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-slate-500 font-medium">{label}</div>
          <div className="text-3xl font-bold mt-2 text-slate-900">{value}</div>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${accent ?? "bg-brand-50 text-brand-600"}`}>
          {icon}
        </div>
      </div>
      {accent && <div className={`mt-3 h-1 rounded-full ${accent}`}></div>}
    </div>
  );
}
