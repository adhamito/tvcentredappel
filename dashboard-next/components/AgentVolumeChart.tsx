
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DashboardData } from '../types';

interface AgentVolumeChartProps {
  data: DashboardData['agentVolume'];
}

export default function AgentVolumeChart({ data }: AgentVolumeChartProps) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-md border-0 flex flex-col h-full min-h-0 relative overflow-hidden">
      <h2 className="mb-4 text-lg font-bold text-[#5a5a5a] shrink-0 flex items-center uppercase tracking-wider">
        <span className="bg-[#0e677a] w-1.5 h-6 mr-3 rounded-full shadow-sm"></span>
        Volume par Agent (Inbound vs Outbound)
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
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Bar name="Appels Entrants" dataKey="inbound" fill="#0e677a" radius={[4, 4, 0, 0]} barSize={20} />
            <Bar name="Appels Sortants" dataKey="outbound" fill="#f59f14" radius={[4, 4, 0, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
