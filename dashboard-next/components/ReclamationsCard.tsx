import React from 'react';
import { AlertCircle, MessageSquare } from 'lucide-react';

interface Props {
  total: number;
  open: number;
  highUrgency: number;
}

export default function ReclamationsCard({ total, open, highUrgency }: Props) {
  return (
    <div className="dash-card p-3 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-2">
        <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
        <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Réclamations</h3>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider">Total</span>
          <span className="text-lg font-bold text-slate-900">{total}</span>
        </div>
        <div className="h-px bg-slate-200/60" />
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider">En cours</span>
          <span className="text-lg font-bold text-teal-600">{open}</span>
        </div>
        <div className="h-px bg-slate-200/60" />
        <div
          className="flex items-center justify-between rounded-lg px-2 py-1.5 border"
          style={{ backgroundColor: 'var(--warning-soft)', borderColor: 'var(--warning-border)' }}
        >
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-3 h-3" style={{ color: 'var(--warning)' }} />
            <span
              className="text-[10px] uppercase tracking-wider font-medium"
              style={{ color: '#B45309' }}
            >
              Urgence
            </span>
          </div>
          <span className="text-lg font-bold" style={{ color: 'var(--warning)' }}>
            {highUrgency}
          </span>
        </div>
      </div>
    </div>
  );
}
