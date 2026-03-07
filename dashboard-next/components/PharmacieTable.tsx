import React from 'react';
import { DashboardData } from '../types';

interface PharmacieTableProps {
  /** Array of pharmacy data including call counts and resolution rates. */
  data: DashboardData['pharmacie'];
}

/**
 * A table component displaying pharmacy performance metrics.
 * Shows total calls and a visual progress bar for resolution rates.
 */
export default function PharmacieTable({ data }: PharmacieTableProps) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-md border-0 flex flex-col h-full min-h-0 relative overflow-hidden">
      <h2 className="mb-4 text-lg font-bold text-[#5a5a5a] shrink-0 flex items-center uppercase tracking-wider">
         <span className="bg-[#0e677a] w-1.5 h-6 mr-3 rounded-full shadow-sm"></span>
         Pharmacie & Taux de Résolution
      </h2>
      <div className="flex-1 overflow-auto min-h-0 custom-scrollbar">
        <table className="min-w-full">
          <thead className="sticky top-0 z-10 bg-white border-b border-[#e0e0e0]">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-[10px] font-bold text-[#5a5a5a] uppercase tracking-widest">Pharmacie</th>
              <th scope="col" className="px-4 py-3 text-left text-[10px] font-bold text-[#5a5a5a] uppercase tracking-widest">Appels</th>
              <th scope="col" className="px-4 py-3 text-left text-[10px] font-bold text-[#5a5a5a] uppercase tracking-widest">Taux</th>
            </tr>
          </thead>
          <tbody className="bg-transparent">
            {data?.map((row, idx) => (
              <tr key={idx} className="hover:bg-[#f0f2f5] transition-colors border-b border-[#f0f2f5] last:border-0">
                <td className="px-4 py-3 whitespace-nowrap text-xs font-semibold text-slate-700 truncate max-w-[150px]" title={row.pharmacie_name}>{row.pharmacie_name || 'Unknown'}</td>
                <td className="px-4 py-3 whitespace-nowrap text-xs font-bold text-slate-500">{row.total_calls}</td>
                <td className="px-4 py-3 whitespace-nowrap text-xs align-middle">
                  <div className="flex items-center w-full max-w-[120px]">
                    <span className={`text-[10px] font-bold w-8 ${
                        row.resolution_rate >= 90 ? 'text-[#0e677a]' : 
                        row.resolution_rate >= 70 ? 'text-yellow-600' : 
                        'text-red-500'
                    }`}>
                        {row.resolution_rate}%
                    </span>
                    <div className="flex-1 h-2 bg-[#f0f2f5] rounded-full overflow-hidden ml-2 shadow-inner">
                        <div 
                            className={`h-full rounded-full ${
                                row.resolution_rate >= 90 ? 'bg-gradient-to-r from-[#0e677a] to-[#6bb9c8]' : 
                                row.resolution_rate >= 70 ? 'bg-gradient-to-r from-[#f59f14] to-[#fbbf24]' : 
                                'bg-gradient-to-r from-red-500 to-red-400'
                            }`} 
                            style={{ width: `${row.resolution_rate}%` }}
                        ></div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
