import React from 'react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, ReferenceLine, Legend, Tooltip } from 'recharts';
import { DashboardData } from '../types';

interface Props {
  data: DashboardData['agentVolume'];
}

export default function StatusInOutChart({ data }: Props) {
  // Make outbound negative for diverging bar chart effect
  const chartData = data.map(d => ({
    ...d,
    outboundNeg: -Math.abs(d.outbound)
  }));

  return (
    <div className="rounded-[24px] bg-white/40 backdrop-blur-3xl shadow-[0_10px_30px_-10px_rgba(14,103,122,0.3),inset_0_1px_0_rgba(255,255,255,0.3)] border border-white/20 border-t-[1px] border-t-white/30 p-6 flex flex-col h-full min-h-0 relative overflow-hidden">
      <h2 className="mb-4 text-2xl font-semibold text-slate-700 shrink-0 flex items-center uppercase tracking-[0.1em]">
        <span className="bg-[#0e677a] w-2 h-6 mr-3 rounded-full shadow-sm"></span>
        Flux Statut
      </h2>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 20, right: 20, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="gradIn" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#1e3a8a" stopOpacity={0.8}/>
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={1}/>
              </linearGradient>
              <linearGradient id="gradOut" x1="1" y1="0" x2="0" y2="0">
                <stop offset="0%" stopColor="#d97706" stopOpacity={0.8}/>
                <stop offset="100%" stopColor="#fbbf24" stopOpacity={1}/>
              </linearGradient>
            </defs>
            <XAxis type="number" hide domain={['dataMin', 'dataMax']} />
            <YAxis 
              type="category" 
              dataKey="agent" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: '1.2rem', fill: '#64748b', fontWeight: 600 }}
              width={100}
            />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.1)' }}
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.5)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                fontWeight: 600,
                color: '#334155'
              }}
              formatter={(value: any, name: any) => [Math.abs(Number(value)), String(name)]}
            />
            <Legend 
              verticalAlign="top" 
              align="center" 
              iconType="circle"
              wrapperStyle={{ fontSize: '1.1rem', fontWeight: 600, color: '#475569', paddingBottom: '20px' }}
            />
            <ReferenceLine x={0} stroke="#94a3b8" strokeWidth={2} opacity={0.5} />
            <Bar name="Inbound" dataKey="inbound" fill="url(#gradIn)" radius={[0, 12, 12, 0]} maxBarSize={25} stackId="a" style={{ filter: 'drop-shadow(0 0 8px rgba(59,130,246,0.5))' }} />
                    <Bar name="Outbound" dataKey="outboundNeg" fill="url(#gradOut)" radius={[12, 0, 0, 12]} maxBarSize={25} stackId="a" style={{ filter: 'drop-shadow(0 0 8px rgba(251,191,36,0.5))' }} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
