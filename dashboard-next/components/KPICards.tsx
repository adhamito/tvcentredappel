import React from 'react';
import { TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import { DashboardData } from '../types';

interface KPICardsProps {
  /** The KPI data object containing volume, resolution rate, and top issue. */
  data: DashboardData['kpi'];
}

/**
 * Displays the main Key Performance Indicators (KPIs) at the top of the dashboard.
 * Includes: Total Volume, Global Resolution Rate (with circular progress), and Top Issue.
 */
export default function KPICards({ data }: KPICardsProps) {
  return (
    <>
      <div className="flex flex-col justify-between relative overflow-hidden group transition-all duration-500 py-1">
          <div className="absolute top-0 right-0 opacity-[0.03] pointer-events-none">
              <TrendingUp className="w-[8rem] h-[8rem] text-[#0a192f] scale-150 opacity-90" />
          </div>
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.1em]">TOTAL VOLUME</h3>
          <div className="text-5xl font-black text-slate-900 tracking-[-0.05em] drop-shadow-md mt-1 mb-0 leading-none">
              {data?.totalVolume || 0}
          </div>
      </div>

      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-slate-300/80 to-transparent my-1 shrink-0"></div>

      <div className="flex flex-col items-center justify-center relative overflow-hidden py-1">
           <div className="absolute top-0 right-0 opacity-[0.03] pointer-events-none">
              <CheckCircle className="w-[8rem] h-[8rem] text-[#10b981] scale-150 opacity-90" />
           </div>
           <h3 className="text-sm font-black text-slate-700 uppercase tracking-[0.1em] mb-1 w-full text-left relative z-10">RESOLUTION RATE</h3>
           
           <div className="h-32 w-32 relative flex items-center justify-center mt-1 mb-1 mx-auto">
               <svg className="h-full w-full transform -rotate-90 drop-shadow-[0_0_14px_rgba(16,185,129,0.45)]" viewBox="0 0 36 36">
                   <defs>
                     <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                       <stop offset="0%" stopColor="#10b981" />
                       <stop offset="100%" stopColor="#059669" />
                     </linearGradient>
                     <mask id="ringMask">
                       <circle cx="18" cy="18" r="16" fill="none" stroke="white" strokeWidth="6" strokeDasharray="4 2" />
                     </mask>
                   </defs>
                   <circle cx="18" cy="18" r="16" fill="none" className="stroke-slate-200/60" strokeWidth="6" mask="url(#ringMask)" />
                   <circle cx="18" cy="18" r="16" fill="none" stroke="url(#ringGradient)" strokeWidth="6" strokeDasharray={`${data?.globalResolutionRate || 0} 100`} mask="url(#ringMask)" />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                   <div className="text-3xl font-black text-slate-900 tracking-[-0.05em] drop-shadow-md leading-none">
                     {data?.globalResolutionRate || 0}%
                 </div>
                 <div className="text-sm font-black text-teal-500 mt-1 flex items-center bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/30 shadow-[0_0_10px_rgba(20,184,166,0.3)] tracking-wider">
                     ↑ 2%
                 </div>
               </div>
            </div>
      </div>

      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-slate-300/80 to-transparent my-1 shrink-0"></div>

      <div className="flex flex-col justify-between relative overflow-hidden py-1 rounded-b-[2rem]">
          <div className="absolute top-0 right-0 opacity-[0.03] pointer-events-none">
              <AlertCircle className="w-[8rem] h-[8rem] text-[#ef4444] scale-150 opacity-90" />
          </div>
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.1em] relative z-10">TOP ISSUE</h3>
          <div className="flex-1 flex items-center justify-center mt-2 mb-2 relative z-10">
              <div className="w-full bg-red-500/10 border border-red-500/50 rounded-2xl p-3 flex items-center shadow-[0_0_15px_rgba(239,68,68,0.4)] relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#ef4444]/10 animate-[pulse_2s_ease-in-out_infinite] pointer-events-none"></div>
                  <AlertCircle className="text-[#ef4444] w-6 h-6 shrink-0 animate-[ping_3s_ease-in-out_infinite] absolute opacity-20" />
                  <AlertCircle className="text-[#ef4444] w-5 h-5 shrink-0 mr-2 relative z-10 scale-125 opacity-90" />
                  <div className="text-lg font-black text-[#ef4444] leading-tight line-clamp-2 relative z-10">
                      {data?.topIssue || 'None'}
                  </div>
              </div>
          </div>
      </div>
    </>
  );
}
