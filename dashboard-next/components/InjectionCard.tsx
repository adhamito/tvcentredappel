import React from 'react';
import { Syringe, TrendingUp } from 'lucide-react';

interface Props {
  count: number;
}

export default function InjectionCard({ count }: Props) {
  return (
    <div className="flex flex-col h-full relative overflow-hidden group py-1">
        <div className="absolute top-0 right-0 opacity-[0.03] pointer-events-none">
            <Syringe className="w-[8rem] h-[8rem] text-[#4f46e5] scale-150 opacity-90" />
        </div>
        <div className="flex items-center justify-between mb-2 relative z-10">
            <h3 className="text-sm font-black text-slate-700 uppercase tracking-[0.1em] flex items-center">
                <Syringe className="w-4 h-4 mr-3 text-[#4f46e5] scale-150 opacity-90" />
                INJECTIONS
            </h3>
        </div>

        <div className="flex-1 flex flex-col justify-center relative z-10">
            <div className="flex items-end justify-between bg-white/20 p-3 rounded-xl border border-white/30 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                <div>
                    <div className="text-3xl font-black text-slate-900 leading-none tracking-[-0.05em] drop-shadow-md">{count}</div>
                    <div className="text-[10px] font-black text-slate-800 uppercase tracking-[0.1em] mt-1">TOTAL EFFECTUÉ</div>
                </div>
                <div className="h-8 w-8 rounded-full bg-[#4f46e5]/10 flex items-center justify-center border border-[#4f46e5]/25">
                    <TrendingUp className="w-4 h-4 text-[#4f46e5]" />
                </div>
            </div>
        </div>
    </div>
  );
}
