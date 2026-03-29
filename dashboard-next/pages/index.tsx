import Head from 'next/head';
import useSWR from 'swr';
import { Loader2 } from 'lucide-react';
import WeeklyVolumeByAgent from '../components/WeeklyVolumeByAgent';
import WeeklyLinesChart from '../components/WeeklyLinesChart';
import StatusInOutChart from '../components/StatusInOutChart';
import TypologieChart from '../components/TypologieChart';
import ReclamationsCard from '../components/ReclamationsCard';
import InjectionCard from '../components/InjectionCard';
import KPICards from '../components/KPICards';
import { DashboardData } from '../types';
import { fetcher } from '../utils/helpers';

export default function Home() {
  const now = new Date();
  const selectedYear = String(now.getFullYear());
  const selectedMonth = String(now.getMonth() + 1);

  const { data, error } = useSWR<DashboardData>(
    `/api/dashboard?service=${encodeURIComponent('Centre d’appel')}&year=${selectedYear}&month=${selectedMonth}`, 
    fetcher, 
    {
      refreshInterval: 60000, // Auto-refresh every 60 seconds
    }
  );

  if (error) return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50 text-red-500 font-bold">
      Failed to load dashboard data.
    </div>
  );

  if (!data) return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-[#0e677a]" size={48} />
    </div>
  );

  return (
    <div className="h-screen w-full bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#eef2ff] p-4 md:p-6 font-sans text-slate-800 selection:bg-[#0e677a] selection:text-white flex flex-col overflow-hidden">
      <Head>
        <title>Centre d&apos;Appel Intelligence Hub</title>
        <meta name="description" content="Real-time performance metrics" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-full flex flex-col h-full gap-4 relative">
        {/* Faint gradient orb in the background */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#004e64] opacity-[0.02] blur-[120px] rounded-full pointer-events-none -z-20"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#0e677a] opacity-[0.02] blur-[150px] rounded-full pointer-events-none -z-20"></div>
        
        {/* Animated Indigo Orb behind sidebar */}
        <div className="absolute top-[20%] left-[0%] w-[50%] h-[70%] bg-indigo-500 opacity-5 blur-[120px] rounded-full pointer-events-none -z-20 animate-[pulse_10s_ease-in-out_infinite]"></div>
        
        {/* Soft, semi-transparent background for the main container with blur */}
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[12px] rounded-[3rem] border border-white/40 shadow-2xl -z-10 pointer-events-none"></div>

        <div className="flex flex-row h-full p-4 md:p-6 gap-8 min-w-0 max-w-full">
          {/* L-Shape Left Column: KPI Sidebar (3 Units) - Unified Glass Panel */}
          <div className="w-[400px] flex flex-col h-full overflow-y-auto hide-scrollbar rounded-[2rem] bg-white/40 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-white/20 border-t-[1px] border-t-white/30 p-6 gap-6 shrink-0">
            <div className="flex flex-col gap-5 h-full">
              <KPICards 
                data={data.kpi} 
              />
              
              <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-slate-300/80 to-transparent shrink-0"></div>

              <div className="flex-1 min-h-0">
                <ReclamationsCard 
                  total={data.weekly?.complaintsCount || data.kpi.totalVolume} 
                  open={data.weekly?.openCount || 0}
                  highUrgency={data.weekly?.highUrgencyCount || 0}
                />
              </div>

              <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-slate-300/80 to-transparent shrink-0"></div>

              <div className="flex-1 min-h-0">
                <InjectionCard count={data.weekly?.injCount || 0} />
              </div>
            </div>
          </div>
          
          {/* L-Shape Main Area (Bento Grid) */}
          <div className="flex-1 grid grid-cols-3 grid-rows-[55%_minmax(0,1fr)] gap-8 h-full overflow-hidden min-w-0">
            {/* Top row of Main Area */}
            <div className="col-span-2 row-span-1 min-h-0">
              <WeeklyVolumeByAgent 
                weeks={data.weekly?.weeks || []} 
                series={data.weekly?.volumeByAgent || []} 
              />
            </div>
            <div className="col-span-1 row-span-1 min-h-0">
              <WeeklyLinesChart 
                weeks={data.weekly?.weeks || []} 
                lines={data.weekly?.linesPerWeek || []} 
              />
            </div>
            
            {/* Bottom row of Main Area */}
            <div className="col-span-1 row-span-1 min-h-0">
              <TypologieChart data={data.typologie} />
            </div>
            <div className="col-span-2 row-span-1 min-h-0">
              <StatusInOutChart data={data.agentVolume || []} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
