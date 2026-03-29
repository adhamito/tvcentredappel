import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { DashboardData } from '../types';

interface TypologieChartProps {
  /** Array of typology data containing category names and totals. */
  data: DashboardData['typologie'];
}

/**
 * A sleek Radar Chart displaying call volume by typology (category) 
 * for a high-tech "Command Center" look.
 */
export default function TypologieChart({ data }: TypologieChartProps) {
  return (
    <div className="rounded-[24px] bg-white/40 backdrop-blur-3xl shadow-[0_10px_30px_-10px_rgba(14,103,122,0.3),inset_0_1px_0_rgba(255,255,255,0.3)] border border-white/20 border-t-[1px] border-t-white/30 p-6 flex flex-col h-full min-h-0 relative overflow-hidden">
      <h2 className="mb-4 text-2xl font-semibold text-slate-700 shrink-0 flex items-center uppercase tracking-[0.1em]">
        <span className="bg-[#0e677a] w-2 h-6 mr-3 rounded-full shadow-sm"></span>
        Typologie
      </h2>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
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
              itemStyle={{ color: '#0f172a', fontWeight: 700 }}
              formatter={(value: any, name: any) => [`${value} appels`, String(name)]}
            />
            <Pie
              data={data}
              dataKey="total"
              nameKey="typologie"
              cx="50%"
              cy="45%"
              innerRadius="50%"
              outerRadius="75%"
              paddingAngle={5}
              label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
                if (!percent || percent < 0.04 || midAngle === undefined) return null;
                const RADIAN = Math.PI / 180;
                const radius = outerRadius * 1.25;
                const x = Number(cx) + radius * Math.cos(-midAngle * RADIAN);
                const y = Number(cy) + radius * Math.sin(-midAngle * RADIAN);
                
                return (
                  <text 
                    x={x} 
                    y={y} 
                    fill="#475569" 
                    textAnchor={x > Number(cx) ? 'start' : 'end'} 
                    dominantBaseline="central"
                    fontSize={30}
                    fontWeight={800}
                  >
                    {`${(percent * 100).toFixed(0)}%`}
                  </text>
                );
              }}
              labelLine={false}
            >
              {data.map((entry, index) => {
                const colors = ['#0e677a', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];
                return (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={colors[index % colors.length]} 
                    style={{ filter: `drop-shadow(0 0 8px ${colors[index % colors.length]}60)` }} 
                  />
                );
              })}
            </Pie>
            <Legend
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                wrapperStyle={{
                  paddingTop: '5px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#475569',
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  gap: '8px'
                }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
