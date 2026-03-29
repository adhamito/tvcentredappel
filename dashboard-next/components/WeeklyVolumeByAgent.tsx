import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { DashboardData } from '../types';

interface Props {
  weeks: NonNullable<DashboardData['weekly']>['weeks'];
  series: NonNullable<DashboardData['weekly']>['volumeByAgent'];
}

export default function WeeklyVolumeByAgent({ weeks, series }: Props) {
  const data = weeks.map((w, idx) => {
    const row: Record<string, number | string> = { week: w };
    series.forEach((s) => {
      row[s.agent] = s.series[idx] ?? 0;
    });
    return row;
  });
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];
  return (
      <div className="rounded-[24px] bg-white/40 backdrop-blur-3xl shadow-[0_10px_30px_-10px_rgba(30,58,138,0.3),inset_0_1px_0_rgba(255,255,255,0.3)] border border-white/20 border-t-[1px] border-t-white/30 p-6 flex flex-col h-full min-h-0 relative overflow-hidden">
        <h2 className="mb-4 text-2xl font-semibold text-slate-700 shrink-0 flex items-center uppercase tracking-[0.1em]">
          <span className="bg-[#0e677a] w-2 h-6 mr-3 rounded-full shadow-sm"></span>
          Volume par Collaborateur (Semaine)
        </h2>
        <div className="flex-1 min-h-0 relative w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
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
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{
                  padding: '0.5rem 1rem',
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  display: 'flex',
                  justifyContent: 'flex-end',
                  flexWrap: 'wrap',
                  gap: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '1rem',
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                  marginBottom: '20px'
                }}
                iconType="circle"
                iconSize={12}
                formatter={(value, entry: { color?: string }) => (
                  <span style={{ color: entry.color ?? '#0f172a', marginLeft: '0.25rem', marginRight: '0.5rem' }}>{value}</span>
                )}
              />
            {series.slice(0, 5).map((s, i) => {
              return (
                <Line 
                  type="monotone"
                  key={s.agent} 
                  dataKey={s.agent} 
                  stroke={colors[i % colors.length]}
                  strokeWidth={4}
                  dot={{ r: 6, fill: '#fff', strokeWidth: 3, stroke: colors[i % colors.length] }}
                  activeDot={{ r: 10 }}
                  style={{ filter: `drop-shadow(0 0 8px ${colors[i % colors.length]}80)` }} 
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
