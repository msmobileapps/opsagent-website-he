'use client';

import { useState } from 'react';
import { agents } from '@/lib/mock-data';
import { clsx } from 'clsx';
import { Bell, Clock, Mail, Shield, CreditCard, Receipt, TrendingUp, Zap } from 'lucide-react';

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={clsx(
        'w-10 h-5.5 rounded-full transition-colors relative',
        enabled ? 'bg-brand-500' : 'bg-surface-overlay'
      )}
      style={{ height: '22px' }}
    >
      <span
        className={clsx(
          'absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow',
          enabled ? 'translate-x-5' : 'translate-x-0.5'
        )}
      />
    </button>
  );
}

const billingItems = [
  { label: 'Agent runs this month', value: '247', limit: '/ Unlimited', icon: Zap },
  { label: 'Documents generated', value: '34', limit: '/ Unlimited', icon: Receipt },
  { label: 'Active agents', value: '10', limit: '/ 15 max', icon: TrendingUp },
];

const invoiceHistory = [
  { date: 'Mar 1, 2026', amount: '₪3,500', status: 'Paid', plan: 'Growth' },
  { date: 'Feb 1, 2026', amount: '₪3,500', status: 'Paid', plan: 'Growth' },
  { date: 'Jan 1, 2026', amount: '₪1,500', status: 'Paid', plan: 'Starter' },
];

export default function SettingsPage() {
  const [schedules, setSchedules] = useState(
    agents.map(a => ({ id: a.id, name: a.name, schedule: a.schedule, enabled: true }))
  );
  const [notifications, setNotifications] = useState({
    email: true,
    onFailure: true,
    dailyDigest: true,
    weeklyReport: false,
  });

  const toggleAgent = (id: string) => {
    setSchedules(s => s.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Configure agents, notifications, and billing</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Agent Schedules */}
        <div className="bg-surface-raised border border-surface-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <Clock className="w-4 h-4 text-brand-400" />
            <h2 className="text-base font-semibold text-white">Agent Schedules</h2>
          </div>
          <div className="space-y-3">
            {schedules.map(agent => (
              <div
                key={agent.id}
                className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-surface/50"
              >
                <div>
                  <p className="text-sm text-white font-medium">{agent.name}</p>
                  <p className="text-xs text-gray-500">{agent.schedule}</p>
                </div>
                <Toggle enabled={agent.enabled} onToggle={() => toggleAgent(agent.id)} />
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Notifications */}
          <div className="bg-surface-raised border border-surface-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-5">
              <Bell className="w-4 h-4 text-brand-400" />
              <h2 className="text-base font-semibold text-white">Notifications</h2>
            </div>
            <div className="space-y-3">
              {[
                { key: 'email' as const, label: 'Email notifications', desc: 'Get notified after each agent run', icon: Mail },
                { key: 'onFailure' as const, label: 'Failure alerts', desc: 'Immediate alert when an agent fails', icon: Shield },
                { key: 'dailyDigest' as const, label: 'Daily digest', desc: 'Summary of all operations at end of day', icon: Clock },
                { key: 'weeklyReport' as const, label: 'Weekly report', desc: 'Comprehensive weekly performance report', icon: Bell },
              ].map(item => (
                <div
                  key={item.key}
                  className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-surface/50"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-white font-medium">{item.label}</p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                  <Toggle
                    enabled={notifications[item.key]}
                    onToggle={() => setNotifications(n => ({ ...n, [item.key]: !n[item.key] }))}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Delivery settings */}
          <div className="bg-surface-raised border border-surface-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-5">
              <Mail className="w-4 h-4 text-brand-400" />
              <h2 className="text-base font-semibold text-white">Delivery</h2>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider">Email</label>
                <input
                  type="email"
                  defaultValue="michal@msapps.co.il"
                  className="mt-1 w-full bg-surface border border-surface-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider">Timezone</label>
                <input
                  type="text"
                  defaultValue="Asia/Jerusalem"
                  className="mt-1 w-full bg-surface border border-surface-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Billing section — full width */}
      <div className="mt-6 grid grid-cols-2 gap-6">
        {/* Plan & Usage */}
        <div className="bg-surface-raised border border-surface-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-brand-400" />
              <h2 className="text-base font-semibold text-white">Plan & Usage</h2>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-brand-500/15 text-brand-400 border border-brand-500/20">
              Growth Plan
            </span>
          </div>

          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-3xl font-bold text-white">₪3,500</span>
            <span className="text-sm text-gray-500">/ month</span>
          </div>

          <div className="space-y-3">
            {billingItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-surface/50">
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-300">{item.label}</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-semibold text-white">{item.value}</span>
                    <span className="text-xs text-gray-500">{item.limit}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-surface-border flex items-center justify-between">
            <p className="text-xs text-gray-500">Next billing: April 1, 2026</p>
            <button className="text-xs font-medium text-brand-400 hover:text-brand-300 transition-colors">
              Upgrade Plan
            </button>
          </div>
        </div>

        {/* Invoice History */}
        <div className="bg-surface-raised border border-surface-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <Receipt className="w-4 h-4 text-brand-400" />
            <h2 className="text-base font-semibold text-white">Invoice History</h2>
          </div>

          <div className="space-y-2">
            {invoiceHistory.map((inv, i) => (
              <div key={i} className="flex items-center justify-between py-3 px-3 rounded-lg bg-surface/50">
                <div>
                  <p className="text-sm text-white font-medium">{inv.date}</p>
                  <p className="text-xs text-gray-500">{inv.plan} Plan</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-white">{inv.amount}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-accent-500/20 text-accent-400">
                    {inv.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-surface-border">
            <button className="text-xs font-medium text-brand-400 hover:text-brand-300 transition-colors">
              View All Invoices
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
