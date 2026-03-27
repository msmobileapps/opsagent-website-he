'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { useState } from 'react';
import {
  LayoutDashboard,
  Bot,
  History,
  BarChart3,
  Settings,
  Zap,
  Menu,
  X,
  FileText,
  ShieldCheck,
  ChevronDown,
  Circle,
} from 'lucide-react';
import { useClient } from '@/lib/client-context';

const nav = [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
  { href: '/agents', label: 'Agents', icon: Bot },
  { href: '/documents', label: 'Documents', icon: FileText },
  { href: '/approvals', label: 'Approvals', icon: ShieldCheck },
  { href: '/history', label: 'History', icon: History },
  { href: '/metrics', label: 'Metrics', icon: BarChart3 },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [clientDropdownOpen, setClientDropdownOpen] = useState(false);
  const { clients, selectedClient, setSelectedClientId } = useClient();

  return (
    <>
      {/* Mobile header bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-surface border-b border-surface-border z-50 flex items-center px-4 gap-3">
        <button onClick={() => setOpen(true)} className="p-1.5 rounded-lg hover:bg-surface-raised">
          <Menu className="w-5 h-5 text-gray-300" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <h1 className="text-sm font-bold text-white">OpsAgent</h1>
        </div>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 bg-black/60 z-50" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed top-0 h-screen w-60 bg-surface border-r border-surface-border flex flex-col z-50 transition-transform duration-200',
          'lg:left-0 lg:translate-x-0',
          open ? 'left-0 translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="p-5 border-b border-surface-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight">OpsAgent</h1>
              <p className="text-[10px] text-gray-500 -mt-0.5">Operations Platform</p>
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="lg:hidden p-1 rounded hover:bg-surface-raised">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                  active
                    ? 'bg-brand-500/15 text-brand-400 glow-brand'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-surface-raised'
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Client Switcher */}
        <div className="p-4 border-t border-surface-border">
          <div className="relative">
            <button
              onClick={() => setClientDropdownOpen(!clientDropdownOpen)}
              className="w-full bg-surface-raised rounded-lg p-3 text-left hover:bg-surface-raised/80 transition-colors"
            >
              <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Client</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">
                    {selectedClient?.name || 'Select client'}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Circle
                      className={clsx(
                        'w-2 h-2 fill-current',
                        selectedClient?.connected ? 'text-emerald-400' : 'text-gray-500'
                      )}
                    />
                    <p className="text-xs text-gray-500">
                      {selectedClient
                        ? `${selectedClient.enabledAgents} agents active`
                        : 'No client selected'}
                    </p>
                  </div>
                </div>
                {clients.length > 1 && (
                  <ChevronDown
                    className={clsx(
                      'w-4 h-4 text-gray-500 transition-transform',
                      clientDropdownOpen && 'rotate-180'
                    )}
                  />
                )}
              </div>
            </button>

            {/* Dropdown */}
            {clientDropdownOpen && clients.length > 1 && (
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-surface border border-surface-border rounded-lg shadow-xl overflow-hidden z-50">
                {clients.map(client => (
                  <button
                    key={client.id}
                    onClick={() => {
                      setSelectedClientId(client.id);
                      setClientDropdownOpen(false);
                    }}
                    className={clsx(
                      'w-full px-3 py-2.5 text-left flex items-center gap-2 hover:bg-surface-raised transition-colors',
                      client.id === selectedClient?.id && 'bg-brand-500/10'
                    )}
                  >
                    <Circle
                      className={clsx(
                        'w-2 h-2 fill-current shrink-0',
                        client.connected ? 'text-emerald-400' : 'text-gray-500'
                      )}
                    />
                    <div className="min-w-0">
                      <p className={clsx(
                        'text-sm font-medium truncate',
                        client.id === selectedClient?.id ? 'text-brand-400' : 'text-white'
                      )}>
                        {client.name}
                      </p>
                      <p className="text-[10px] text-gray-500 truncate">
                        {client.industry} — {client.enabledAgents}/{client.totalAgents} agents
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
