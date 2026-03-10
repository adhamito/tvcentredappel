import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DashboardData } from '../types';

interface VilleChartProps {
  /** Array of city data containing city names and call totals. */
  data: DashboardData['ville'];
}

/**
 * A vertical bar chart displaying call volume by city (Ville).
 * Uses a rotating color palette for visual distinction between bars.
 */
export default function VilleChart({ data }: VilleChartProps) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-md border-0 flex flex-col h-full min-h-0 relative overflow-hidden">
      <h2 className="mb-4 text-lg font-bold text-[#5a5a5a] shrink-0 flex items-center uppercase tracking-wider">
         <span className="bg-[#1e3a8a] w-1.5 h-6 mr-3 rounded-full shadow-sm"></span>
         Performance par Ville
      </h2>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
                <linearGradient id="gradRed" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#991b1b" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
                <linearGradient id="gradBlue" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#1e3a8a" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
                <linearGradient id="gradYellow" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#854d0e" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
                <linearGradient id="gradGreen" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#065f46" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
                <linearGradient id="gradPurple" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#4c1d95" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
                <linearGradient id="gradPink" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#831843" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e0e0e0" opacity={0.5} />
            <XAxis type="number" hide />
            <YAxis dataKey="ville" type="category" width={100} tick={{fontSize: 10, fill: '#5a5a5a', fontWeight: 600}} />
            <Tooltip 
                cursor={{fill: '#f0f2f5', opacity: 0.4}}
                contentStyle={{backgroundColor: '#ffffff', borderColor: '#e0e0e0', color: '#0e677a', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '12px'}}
            />
            <Bar dataKey="total" radius={[0, 12, 12, 0]} barSize={20} isAnimationActive={true}>
              {data?.map((_, index) => {
                const ids = ['url(#gradRed)','url(#gradBlue)','url(#gradYellow)','url(#gradGreen)','url(#gradPurple)','url(#gradPink)'];
                return <Cell key={`cell-${index}`} fill={ids[index % ids.length]} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
