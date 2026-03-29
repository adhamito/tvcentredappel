import React from 'react';
import { AlertCircle, MessageSquare } from 'lucide-react';

interface Props {
  total: number;
  open: number;
  highUrgency: number;
}

export default function ReclamationsCard({ total, open, highUrgency }: Props) {
  return (
    <div className="flex flex-col h-full relative overflow-hidden group py-1">
        <div className="absolute top-0 right-0 opacity-[0.03] pointer-events-none">
            <MessageSquare className="w-[8rem] h-[8rem] text-[#0e677a] scale-150 opacity-90" />
        </div>
        <div className="flex items-center justify-between mb-2 relative z-10">
            <h3 className="text-sm font-black text-slate-700 uppercase tracking-[0.1em] flex items-center">
                <MessageSquare className="w-4 h-4 mr-3 text-[#0e677a] scale-150 opacity-90" />
                RÉCLAMATIONS
            </h3>
        </div>

        <div className="flex-1 flex flex-col justify-center gap-2 relative z-10">
            <div className="flex items-center justify-between bg-white/20 p-3 rounded-xl border border-white/30 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                <div>
                    <div className="text-3xl font-black text-slate-900 leading-none tracking-[-0.05em] drop-shadow-sm">{total}</div>
                    <div className="text-[10px] font-black text-slate-800 uppercase tracking-wider mt-1">TOTAL</div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-black text-emerald-600 leading-none tracking-[-0.05em] drop-shadow-sm">{open}</div>
                    <div className="text-[10px] font-black text-slate-800 uppercase tracking-wider mt-1">EN COURS</div>
                </div>
            </div>

            <div className="flex items-center justify-between bg-red-500/10 p-3 rounded-xl border-2 border-red-500/80 shadow-[0_0_15px_rgba(239,68,68,0.4)] relative overflow-hidden">
                <div className="absolute inset-0 bg-[#ef4444]/5 animate-[pulse_2s_ease-in-out_infinite] pointer-events-none"></div>
                <div className="flex items-center text-red-600 relative z-10">
                    <AlertCircle className="w-4 h-4 mr-2 animate-[pulse_2s_ease-in-out_infinite] scale-125 opacity-100" />
                    <span className="text-[10px] font-black uppercase tracking-wider">URGENCE HAUTE</span>
                </div>
                <div className="text-2xl font-black text-red-600 leading-none tracking-[-0.05em] drop-shadow-md relative z-10">{highUrgency}</div>
            </div>
        </div>
    </div>
  );
}
