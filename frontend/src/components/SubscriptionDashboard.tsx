"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@/hooks/useWallet";

interface Subscription {
  id: string;
  planName: string;
  amount: number;
  intervalDays: number;
  nextRenewal: string;
  status: "active" | "expired" | "cancelled";
}

// Placeholder — replace with real contract query in follow-up PR (ref #2)
const MOCK_SUBS: Subscription[] = [
  { id: "sub_001", planName: "Pro Plan",   amount: 10,  intervalDays: 30, nextRenewal: "2026-09-07", status: "active" },
  { id: "sub_002", planName: "Basic Plan", amount: 5,   intervalDays: 30, nextRenewal: "2026-09-14", status: "active" },
  { id: "sub_003", planName: "Creator",    amount: 25,  intervalDays: 7,  nextRenewal: "2026-08-15", status: "expired" },
];

const STATUS_COLORS: Record<string, string> = {
  active:    "text-green-400 bg-green-900/30 border-green-800/40",
  expired:   "text-amber-400 bg-amber-900/30 border-amber-800/40",
  cancelled: "text-red-400   bg-red-900/30   border-red-800/40",
};

export default function SubscriptionDashboard() {
  const { publicKey } = useWallet();
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!publicKey) return;
    // TODO: replace with fetchSubscriptions(publicKey) from transaction_builder.ts
    setTimeout(() => { setSubs(MOCK_SUBS); setLoading(false); }, 400);
  }, [publicKey]);

  if (!publicKey) return (
    <div className="card text-center text-slate-400 py-12">
      Connect your wallet to view subscriptions.
    </div>
  );

  if (loading) return (
    <div className="card text-center text-slate-400 py-12 animate-pulse">
      Loading subscriptions...
    </div>
  );

  if (subs.length === 0) return (
    <div className="card text-center text-slate-400 py-12">
      No active subscriptions found.
    </div>
  );

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-slate-100 mb-4">My Subscriptions</h2>
      <div className="overflow-x-auto -mx-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              {["Plan", "Amount", "Interval", "Next Renewal", "Status", ""].map(h => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/60">
            {subs.map(s => (
              <tr key={s.id} className="hover:bg-slate-700/30 transition-colors">
                <td className="px-6 py-3.5 font-semibold text-slate-100">{s.planName}</td>
                <td className="px-6 py-3.5 text-slate-300 tabular-nums">{s.amount} XLM</td>
                <td className="px-6 py-3.5 text-slate-400">Every {s.intervalDays}d</td>
                <td className="px-6 py-3.5 text-slate-300 tabular-nums">{s.nextRenewal}</td>
                <td className="px-6 py-3.5">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLORS[s.status]}`}>
                    {s.status}
                  </span>
                </td>
                <td className="px-6 py-3.5">
                  {s.status === "active" && (
                    <button className="text-xs text-red-400 hover:text-red-300 transition-colors">
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
