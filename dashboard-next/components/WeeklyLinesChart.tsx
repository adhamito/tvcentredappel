import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { DashboardData } from '../types';

interface Props {
  weeks: NonNullable<DashboardData['weekly']>['weeks'];
  lines: NonNullable<DashboardData['weekly']>['linesPerWeek'];
}

export default function WeeklyLinesChart({ weeks, lines }: Props) {
  const data = weeks.map((w, idx) => ({ week: w, lines: lines[idx] ?? 0 }));
  return (
    <div className="rounded-[24px] bg-white/40 backdrop-blur-3xl shadow-[0_10px_30px_-10px_rgba(30,58,138,0.3),inset_0_1px_0_rgba(255,255,255,0.3)] border border-white/20 border-t-[1px] border-t-white/30 p-6 flex flex-col h-full min-h-0 relative overflow-hidden">
      <h2 className="mb-4 text-2xl font-semibold text-slate-700 shrink-0 flex items-center uppercase tracking-[0.1em]">
        <span className="bg-[#0e677a] w-2 h-6 mr-3 rounded-full shadow-sm"></span>
        Lignes par Semaine
      </h2>
      <div className="flex-1 min-h-0 relative w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
            <defs>
              <linearGradient id="colorLines" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" opacity={0.5} vertical={false} />
            <XAxis 
              dataKey="week" 
              tick={{ fontSize: '1.15rem', fill: '#64748b', fontWeight: 700 }} 
              axisLine={{ stroke: '#cbd5e1', strokeWidth: 2, strokeLinecap: 'round' }} 
              tickLine={{ stroke: '#cbd5e1', strokeWidth: 2, strokeLinecap: 'round' }} 
              tickSize={8}
              dy={10} 
              padding={{ left: 20, right: 20 }}
            />
            <YAxis 
              tick={{ fontSize: '1.15rem', fill: '#64748b', fontWeight: 700 }} 
              axisLine={{ stroke: '#cbd5e1', strokeWidth: 2, strokeLinecap: 'round' }} 
              tickLine={{ stroke: '#cbd5e1', strokeWidth: 2, strokeLinecap: 'round' }} 
              tickSize={8}
              dx={-10} 
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.5)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                fontWeight: 600,
                color: '#334155'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="lines" 
              stroke="#8b5cf6" 
              fillOpacity={1}
              fill="url(#colorLines)"
              strokeWidth={5} 
              dot={{ r: 6, fill: '#fff', strokeWidth: 3, stroke: '#8b5cf6' }} 
              activeDot={{ r: 10, stroke: '#3b82f6', strokeWidth: 2 }} 
              style={{ filter: `drop-shadow(0 8px 16px rgba(139,92,246,0.6))` }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
