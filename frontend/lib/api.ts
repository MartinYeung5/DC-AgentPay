const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

function key(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("apiKey") ?? "sk_test_demo_001";
}

async function req(path: string, init: RequestInit = {}) {
  const r = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": key(),
      ...(init.headers ?? {})
    }
  });
  if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
  return r.json();
}

export const api = {
  stats:    () => req("/v1/stats"),
  agents:   {
    list:   () => req("/v1/agents"),
    create: (b: any) => req("/v1/agents", { method: "POST", body: JSON.stringify(b) }),
    update: (id: string, b: any) => req(`/v1/agents/${id}`, { method: "PATCH", body: JSON.stringify(b) }),
    remove: (id: string) => req(`/v1/agents/${id}`, { method: "DELETE" }),
    toggle: (id: string, status: string) =>
      req(`/v1/agents/${id}/toggle`, { method: "POST", body: JSON.stringify({ status }) })
  },
  payments: {
    list: (agentId?: string) =>
      req(`/v1/payments${agentId ? `?agentId=${agentId}` : ""}`)
  },
  paymentMethods: {
    list:   () => req("/v1/payment-methods"),
    create: (b: any) => req("/v1/payment-methods", { method: "POST", body: JSON.stringify(b) }),
    update: (id: string, b: any) => req(`/v1/payment-methods/${id}`, { method: "PATCH", body: JSON.stringify(b) }),
    remove: (id: string) => req(`/v1/payment-methods/${id}`, { method: "DELETE" })
  },
  subscriptions: {
    list: (agentId?: string) =>
      req(`/v1/subscriptions${agentId ? `?agentId=${agentId}` : ""}`)
  }
};
