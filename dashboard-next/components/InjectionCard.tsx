import React from 'react';
import { Syringe, TrendingUp, CheckCircle2 } from 'lucide-react';

interface Props {
  count: number;
}

export default function InjectionCard({ count }: Props) {
  const isEmpty = count === 0;

  return (
    <div className="dash-card p-3 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-2">
        <Syringe className="w-3.5 h-3.5 text-slate-500" />
        <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
          Injections
        </h3>
      </div>

      {isEmpty ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-1.5">
          <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xs font-semibold text-slate-800 leading-tight">
            No pending injections
          </p>
          <p className="text-[10px] text-slate-500 leading-tight">
            System active · awaiting data
          </p>
          <span className="glass-badge glass-badge-accent mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 live-dot" />
            Live
          </span>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center">
          <p className="text-3xl font-bold text-slate-900 tracking-tight">{count}</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">
            Total effectué
          </p>
          <div className="mt-2 flex items-center gap-1 text-teal-600">
            <TrendingUp className="w-3 h-3" />
            <span className="text-[10px] font-medium">En cours</span>
          </div>
        </div>
      )}
    </div>
  );
}
