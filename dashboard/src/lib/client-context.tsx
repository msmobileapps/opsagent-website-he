'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface ClientSummary {
  id: string;
  name: string;
  industry: string;
  timezone: string;
  tunnelUrl: string | null;
  vmId: string | null;
  dashboard: {
    route: string;
    language: string;
    rtl: boolean;
    brand_color: string;
    logo_icon: string;
  } | null;
  connected: boolean;
  lastHealthCheck: string | null;
  lastError: string | null;
  enabledAgents: number;
  totalAgents: number;
}

interface ClientContextValue {
  clients: ClientSummary[];
  selectedClient: ClientSummary | null;
  selectedClientId: string;
  setSelectedClientId: (id: string) => void;
  loading: boolean;
  refreshClients: () => Promise<void>;
}

const ClientContext = createContext<ClientContextValue | null>(null);

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';
const STORAGE_KEY = 'opsagent-selected-client';

export function ClientProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<ClientSummary[]>([]);
  const [selectedClientId, setSelectedClientIdState] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const setSelectedClientId = useCallback((id: string) => {
    setSelectedClientIdState(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {}
  }, []);

  const refreshClients = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/clients`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setClients(data.clients || []);

      // Auto-select: restore from localStorage, or pick first client
      if (data.clients?.length > 0) {
        let stored = '';
        try {
          stored = localStorage.getItem(STORAGE_KEY) || '';
        } catch {}
        const validStored = data.clients.find((c: ClientSummary) => c.id === stored);
        if (validStored) {
          setSelectedClientIdState(stored);
        } else {
          setSelectedClientIdState(data.clients[0].id);
        }
      }
    } catch {
      // If /api/clients fails, fall back to /api/status for backward compat
      try {
        const res = await fetch(`${API_BASE}/api/status`);
        if (res.ok) {
          const data = await res.json();
          const fallback: ClientSummary[] = (data.clients || []).map((c: any) => ({
            id: c.id,
            name: c.name,
            industry: c.industry || '',
            timezone: c.timezone || '',
            tunnelUrl: null,
            vmId: null,
            dashboard: null,
            connected: true, // if /api/status works, we're connected locally
            lastHealthCheck: null,
            lastError: null,
            enabledAgents: c.agents?.filter((a: any) => a.enabled).length || 0,
            totalAgents: c.agents?.length || 0,
          }));
          setClients(fallback);
          if (fallback.length > 0) {
            setSelectedClientIdState(fallback[0].id);
          }
        }
      } catch {}
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshClients();
    const interval = setInterval(refreshClients, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, [refreshClients]);

  const selectedClient = clients.find(c => c.id === selectedClientId) || null;

  return (
    <ClientContext.Provider
      value={{
        clients,
        selectedClient,
        selectedClientId,
        setSelectedClientId,
        loading,
        refreshClients,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
}

export function useClient() {
  const ctx = useContext(ClientContext);
  if (!ctx) {
    throw new Error('useClient must be used within a ClientProvider');
  }
  return ctx;
}
