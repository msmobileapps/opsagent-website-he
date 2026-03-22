import { departmentMetrics } from '@/lib/mock-data';
import { Sparkline } from '@/components/sparkline';
import { TrendingUp, Users, Wallet, Megaphone, Settings } from 'lucide-react';

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  'trending-up': TrendingUp,
  users: Users,
  wallet: Wallet,
  megaphone: Megaphone,
  settings: Settings,
};

export default function MetricsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Metrics & KPIs</h1>
        <p className="text-sm text-gray-500 mt-1">Performance measurements across all departments</p>
      </div>

      <div className="space-y-8">
        {departmentMetrics.map(dept => {
          const Icon = icons[dept.icon] || TrendingUp;
          return (
            <div key={dept.department}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-brand-400" />
                </div>
                <h2 className="text-lg font-semibold text-white">{dept.department}</h2>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {dept.kpis.map(kpi => (
                  <div
                    key={kpi.label}
                    className="bg-surface-raised border border-surface-border rounded-xl p-4"
                  >
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">{kpi.label}</p>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-2xl font-bold text-white">
                          {kpi.value}
                          {kpi.unit && <span className="text-sm text-gray-500 ml-1">{kpi.unit}</span>}
                        </p>
                        <p className={`text-xs mt-1 ${kpi.trend >= 0 ? 'text-accent-400' : 'text-red-400'}`}>
                          {kpi.trend >= 0 ? '↑' : '↓'} {Math.abs(kpi.trend)}% vs last month
                        </p>
                      </div>
                      <Sparkline
                        data={kpi.sparkline}
                        color={kpi.trend >= 0 ? '#10B981' : '#EF4444'}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
