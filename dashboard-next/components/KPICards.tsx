import React from 'react';
import { TrendingUp, CheckCircle, AlertCircle, Activity } from 'lucide-react';
import { DashboardData } from '../types';

interface KPICardsProps {
  /** The KPI data object containing volume, resolution rate, and top issue. */
  data: DashboardData['kpi'];
  /** Whether the data is filtered by date. */
  isFiltered?: boolean;
}

/**
 * Displays the main Key Performance Indicators (KPIs) at the top of the dashboard.
 * Includes: Total Volume, Global Resolution Rate (with circular progress), and Top Issue.
 */
export default function KPICards({ data, isFiltered = false }: KPICardsProps) {
  return (
    <div className="grid grid-cols-3 gap-8 mb-8 shrink-0 h-[14vh] w-[95%] mx-auto">
      {/* Total Volume - High Impact */}
      <div className="rounded-xl bg-[#0e677a]/5 p-5 shadow-lg border-0 flex flex-col justify-between relative overflow-hidden group transition-all duration-500">
          <div className="absolute top-0 right-0 p-3 opacity-10">
              <TrendingUp size={64} className="text-[#0e677a]" />
          </div>
          <h3 className="text-xs font-bold text-[#5a5a5a] uppercase tracking-widest">Total Volume</h3>
          <div className="text-5xl font-extrabold text-[#0e677a] tracking-tighter drop-shadow-sm">
              {data?.totalVolume || 0}
          </div>
          <div className="text-[10px] text-[#0e677a]/70 font-medium flex items-center uppercase tracking-wide">
              <span className={`w-2 h-2 rounded-full bg-[#0e677a] mr-2 ${!isFiltered ? 'animate-pulse' : ''}`}></span>
              {isFiltered ? 'Filtered records' : 'All time records'}
          </div>
      </div>

      {/* Global Resolution Rate - Circular Progress */}
      <div className="rounded-xl bg-white p-4 shadow-lg border-0 flex items-center justify-between relative overflow-hidden transform scale-105 z-10 ring-1 ring-[#f0f2f5]">
           <div className="flex flex-col justify-center h-full">
              <h3 className="text-xs font-bold text-[#5a5a5a] uppercase tracking-widest mb-1">Resolution Rate</h3>
              <div className="text-5xl font-black text-[#0e677a] tracking-tighter drop-shadow-sm leading-none">
                  {data?.globalResolutionRate || 0}%
              </div>
              <div className="text-[10px] text-[#0e677a]/60 font-bold mt-2 uppercase tracking-wide">Global efficiency</div>
           </div>
           <div className="h-24 w-24 relative flex items-center justify-center mr-2">
              <svg className="h-full w-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Empty Track */}
                  <path className="text-[#f0f2f5]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                  {/* Filled Track */}
                  <path className="text-[#0e677a]" strokeDasharray={`${data?.globalResolutionRate || 0}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="3" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                  <CheckCircle className="text-[#0e677a] w-8 h-8 opacity-20" />
              </div>
           </div>
      </div>

      {/* Top Issue - Soft Destructive */}
      <div className="rounded-xl bg-red-50 p-5 shadow-lg border-l-[8px] border-red-500 flex flex-col justify-between relative overflow-hidden">
          <h3 className="text-xs font-bold text-red-800 uppercase tracking-widest">Top Issue</h3>
          <div className="flex items-center mt-2">
              <div className="p-3 bg-red-100 rounded-full mr-4 shadow-sm">
                  <AlertCircle className="text-red-600 w-6 h-6 shrink-0" />
              </div>
              <div className="text-xl font-bold text-red-900 leading-tight line-clamp-2">
                  {data?.topIssue || 'None'}
              </div>
          </div>
          <div className="text-[10px] text-red-700 mt-2 font-bold flex items-center uppercase tracking-wide">
              <Activity className="w-3 h-3 mr-1 animate-pulse" />
              Immediate Attention
          </div>
      </div>
    </div>
  );
}
