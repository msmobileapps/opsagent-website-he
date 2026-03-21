'use client';

import { useState } from 'react';
import { agents } from '@/lib/mock-data';
import { clsx } from 'clsx';
import { Bell, Clock, Mail, Shield } from 'lucide-react';

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
        <p className="text-sm text-gray-500 mt-1">Configure agent schedules and notification preferences</p>
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

        {/* Notifications */}
        <div className="space-y-6">
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
    </div>
  );
}
