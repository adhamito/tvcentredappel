import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DashboardData } from '../types';
import { getTypologieColorUrl } from '../utils/helpers';

interface TypologieChartProps {
  /** Array of typology data containing category names and totals. */
  data: DashboardData['typologie'];
}

/**
 * A vertical bar chart displaying call volume by typology (category).
 * Uses semantic gradients based on the typology name (e.g., red for complaints).
 */
export default function TypologieChart({ data }: TypologieChartProps) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-md border-0 flex flex-col h-full min-h-0 relative overflow-hidden">
      <h2 className="mb-4 text-lg font-bold text-[#5a5a5a] shrink-0 flex items-center uppercase tracking-wider">
        <span className="bg-[#0e677a] w-1.5 h-6 mr-3 rounded-full shadow-sm"></span>
        Typologie (Call Categorization)
      </h2>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
          >
            <defs>
                <linearGradient id="gradTeal" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#0e677a" />
                    <stop offset="100%" stopColor="#6bb9c8" />
                </linearGradient>
                <linearGradient id="gradComplaint" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#f87171" />
                    <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
                <linearGradient id="gradNeutral" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
                <linearGradient id="gradCommercial" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#a78bfa" />
                </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e0e0e0" opacity={0.5} />
            <XAxis type="number" hide />
            <YAxis 
                dataKey="typologie" 
                type="category" 
                width={180} 
                tick={{fontSize: 10, fill: '#5a5a5a', fontWeight: 600}} 
                interval={0}
            />
            <Tooltip 
                cursor={{fill: '#f0f2f5', opacity: 0.4}} 
                contentStyle={{backgroundColor: '#ffffff', borderColor: '#e0e0e0', color: '#0e677a', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '12px'}}
            />
            <Bar dataKey="total" radius={[0, 12, 12, 0]} barSize={24}>
                {data?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getTypologieColorUrl(entry.typologie)} />
                ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
