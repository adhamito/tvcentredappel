import React, { useEffect, useRef } from 'react';
import { getTypologieIcon } from '../utils/helpers';
import { Reclamation } from '../types';

interface ReclamationsListProps {
  /** Array of detailed reclamation records. */
  data: Reclamation[];
  /** Loading state flag. */
  isLoading: boolean;
  /** Whether the list is filtered by date. */
  isFiltered?: boolean;
}

/**
 * A scrolling list of recent reclamations (claims).
 * Features an auto-scroll effect and visual status indicators.
 */
export default function ReclamationsList({ data, isLoading, isFiltered = false }: ReclamationsListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const displayedReclamations = data ? [...data, ...data] : [];

  useEffect(() => {
    // Disable auto-scroll if filtered (user might want to read specific records)
    if (isFiltered) return;

    const scrollContainer = scrollRef.current;
    if (!scrollContainer || !data || data.length < 5) return;

    let animationFrameId: number;
    let scrollTop = 0;
    const speed = 0.5; // Pixels per frame

    const step = () => {
      if (!scrollContainer) return;
      
      scrollTop += speed;
      // Seamless looping: When we've scrolled past the first set of data (approx half scrollHeight), reset
      if (scrollTop >= scrollContainer.scrollHeight / 2) {
        scrollTop = 0;
      }
      
      scrollContainer.scrollTop = scrollTop;
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [data, isFiltered]);

  return (
    <div className="col-span-3 rounded-3xl bg-white p-6 shadow-md border-0 flex flex-col h-full min-h-0 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4 shrink-0">
         <h2 className="text-lg font-bold text-[#5a5a5a] shrink-0 flex items-center uppercase tracking-wider">
            <span className="bg-[#0e677a] w-1.5 h-6 mr-3 rounded-full shadow-sm"></span>
            {isFiltered ? 'Filtered Reclamations' : 'Detailed Reclamations'}
         </h2>
         <div className={`flex items-center space-x-3 px-3 py-1 rounded-full border ${isFiltered ? 'bg-blue-50 border-blue-200' : 'bg-[#f0f2f5] border-[#e0e0e0]'}`}>
            <div className={`w-2.5 h-2.5 rounded-full shadow-md ${isFiltered ? 'bg-blue-500' : 'bg-green-500 animate-pulse'}`}></div>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${isFiltered ? 'text-blue-600' : 'text-green-600'}`}>
              {isFiltered ? 'Historical View' : 'Live Feed'}
            </span>
         </div>
      </div>
      
      <div className="flex-1 overflow-hidden relative">
        <div className="flex flex-col h-full">
            {/* Fixed Header */}
            <div className="bg-white shrink-0 z-20 border-b border-[#e0e0e0]">
                <table className="min-w-full">
                    <thead>
                        <tr>
                            <th scope="col" className="px-4 py-3 text-left text-[10px] font-bold text-[#5a5a5a] uppercase tracking-widest w-1/4">Date</th>
                            <th scope="col" className="px-4 py-3 text-left text-[10px] font-bold text-[#5a5a5a] uppercase tracking-widest w-1/2">Details</th>
                            <th scope="col" className="px-4 py-3 text-left text-[10px] font-bold text-[#5a5a5a] uppercase tracking-widest w-1/4">Status</th>
                        </tr>
                    </thead>
                </table>
            </div>
            
            {/* Scrolling Body */}
            <div ref={scrollRef} className="overflow-y-hidden relative flex-1">
                <table className="min-w-full">
                    <tbody className="bg-transparent divide-y divide-slate-100">
                        {isLoading ? (
                        <tr>
                            <td colSpan={3} className="px-4 py-4 text-center text-base text-slate-400 font-medium animate-pulse">Loading real-time data...</td>
                        </tr>
                        ) : displayedReclamations.length === 0 ? (
                        <tr>
                            <td colSpan={3} className="px-4 py-4 text-center text-base text-slate-400 font-medium">No recent records found.</td>
                        </tr>
                        ) : (
                        displayedReclamations.map((rec, index) => {
                            const isClosed = rec.status === 'CLOSED' || rec.cloture;
                            // Use index in key to allow duplicates
                            return (
                                <tr key={`${rec.id}-${index}`} className={`group transition-all duration-500 hover:bg-slate-50 ${!isClosed ? 'bg-red-50/30' : ''}`}>
                                    <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-500 font-medium w-1/4">
                                        {new Date(rec.dateReclamation).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3 w-1/2">
                                        <div className="flex items-center">
                                            <div className={`p-2 rounded-xl mr-3 shadow-sm ${!isClosed ? 'bg-red-100 text-red-500' : 'bg-slate-100 text-slate-400'}`}>
                                                {getTypologieIcon(rec.typologie)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-slate-800">{rec.typologie || 'Unknown'}</span>
                                                <span className="text-[10px] text-slate-400 flex items-center mt-1 font-medium uppercase tracking-wide">
                                                    <span className="w-1 h-1 rounded-full bg-slate-300 mr-1.5"></span>
                                                    {rec.nomOfficine || 'Unknown'}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap w-1/4">
                                        <span className={`px-3 py-1 inline-flex text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm border ${
                                        isClosed 
                                            ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                                            : 'bg-red-100 text-red-700 border-red-200 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.2)]'
                                        }`}>
                                            {isClosed ? 'Closed' : 'Open'}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
}
