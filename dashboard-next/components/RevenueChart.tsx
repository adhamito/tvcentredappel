
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DashboardData } from '../types';

interface RevenueChartProps {
  data: DashboardData['revenue'];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-md border-0 flex flex-col h-full min-h-0 relative overflow-hidden">
      <h2 className="mb-4 text-lg font-bold text-[#5a5a5a] shrink-0 flex items-center uppercase tracking-wider">
        <span className="bg-[#10b981] w-1.5 h-6 mr-3 rounded-full shadow-sm"></span>
        Chiffre d&apos;Affaires par Collaborator
      </h2>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" opacity={0.5} />
            <XAxis dataKey="agent" tick={{fontSize: 12, fill: '#5a5a5a', fontWeight: 600}} />
            <YAxis tick={{fontSize: 10, fill: '#5a5a5a'}} />
            <Tooltip 
                cursor={{fill: '#f0f2f5', opacity: 0.4}}
                contentStyle={{backgroundColor: '#ffffff', borderColor: '#e0e0e0', color: '#0e677a', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '12px'}}
                formatter={(value) => {
                  const num = typeof value === 'number' ? value : Number(value);
                  if (Number.isFinite(num)) return [`${num.toLocaleString()} MAD`, 'Revenue'];
                  return [`${value ?? ''}`, 'Revenue'];
                }}
            />
            <Bar dataKey="revenue" radius={[4, 4, 0, 0]} barSize={30}>
              {data?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#3b82f6'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
