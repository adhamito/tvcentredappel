import React from 'react';
import { TrendingUp, CheckCircle, AlertTriangle, BarChart3 } from 'lucide-react';
import { DashboardData } from '../types';

interface KPICardsProps {
  data: DashboardData['kpi'];
}

export default function KPICards({ data }: KPICardsProps) {
  const rate = data?.globalResolutionRate || 0;

  return (
    <div className="grid grid-cols-4 gap-3">
      {/* Total Volume */}
      <div className="dash-card p-4 flex items-center gap-4 group">
        <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0 group-hover:bg-teal-100/60 transition-colors">
          <BarChart3 className="w-5 h-5 text-teal-600" />
        </div>
        <div>
          <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Total Volume</p>
          <p className="text-2xl font-bold text-slate-900 leading-tight tracking-tight mt-0.5">
            {data?.totalVolume || 0}
          </p>
        </div>
      </div>

      {/* Resolution Rate */}
      <div className="dash-card p-4 flex items-center gap-4 group">
        <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 relative">
          <CheckCircle className="w-5 h-5 text-slate-500" />
        </div>
        <div className="flex-1">
          <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Taux de Résolution</p>
          <div className="flex items-end gap-2 mt-0.5">
            <p className="text-2xl font-bold text-slate-900 leading-tight tracking-tight">{rate}%</p>
            <span className="glass-badge glass-badge-accent mb-0.5">+2%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-teal-500 rounded-full transition-all duration-1000"
              style={{ width: `${rate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Top Issue */}
      <div className="dash-card p-4 flex items-center gap-4 group">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors border"
          style={{ backgroundColor: 'var(--warning-soft)', borderColor: 'var(--warning-border)' }}
        >
          <AlertTriangle className="w-5 h-5" style={{ color: 'var(--warning)' }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Problème Principal</p>
          <p className="text-sm font-semibold text-slate-900 mt-0.5 truncate" title={data?.topIssue || 'None'}>
            {data?.topIssue || 'Aucun'}
          </p>
        </div>
      </div>

      {/* Performance */}
      <div className="dash-card p-4 flex items-center gap-4 group">
        <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
          <TrendingUp className="w-5 h-5 text-slate-500" />
        </div>
        <div>
          <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Performance</p>
          <p className="text-2xl font-bold text-slate-900 leading-tight tracking-tight mt-0.5">
            {rate >= 80 ? 'Excellent' : rate >= 60 ? 'Bon' : 'À améliorer'}
          </p>
        </div>
      </div>
    </div>
  );
}
