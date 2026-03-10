import { useState } from 'react';
import Head from 'next/head';
import useSWR from 'swr';
import { Loader2 } from 'lucide-react';
import DashboardHeader from '../components/DashboardHeader';
import TypologieChart from '../components/TypologieChart';
import VilleChart from '../components/VilleChart';
import AgentVolumeChart from '../components/AgentVolumeChart';
import RevenueChart from '../components/RevenueChart';
import PharmacieTable from '../components/PharmacieTable';
import { DashboardData } from '../types';
import { fetcher } from '../utils/helpers';

export default function Home() {
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(String(now.getFullYear()));
  const [selectedMonth, setSelectedMonth] = useState(String(now.getMonth() + 1));

  const { data, error } = useSWR<DashboardData>(
    `/api/dashboard?year=${selectedYear}&month=${selectedMonth}`, 
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
    <div className="min-h-screen bg-[#f8fafc] p-6 font-sans text-slate-800 selection:bg-[#0e677a] selection:text-white flex flex-col h-screen overflow-hidden">
      <Head>
        <title>Centre d&apos;Appel Intelligence Hub</title>
        <meta name="description" content="Real-time performance metrics" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-[1920px] mx-auto w-full flex flex-col h-full gap-4">
        <DashboardHeader 
          selectedYear={selectedYear}
          onYearChange={(year) => {
            setSelectedYear(year);
            if (year === 'All') setSelectedMonth('All');
          }}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          availableYears={data.availableYears || []}
        />

        <div className="grid grid-cols-12 gap-6 flex-1 min-h-0 w-[98%] mx-auto pb-6">
            {/* Left Quadrants (Charts) - Span 9 columns */}
            <div className="col-span-9 grid grid-cols-2 grid-rows-2 gap-6 h-full">
                {/* Top Left: Call Typology */}
                <TypologieChart data={data.typologie} />
                
                {/* Top Right: Regional/City Distribution */}
                <VilleChart data={data.ville} />
                
                {/* Bottom Left: Call Volume by Agent */}
                <AgentVolumeChart data={data.agentVolume} />
                
                {/* Bottom Right: Revenue per Collaborator */}
                <RevenueChart data={data.revenue} />
            </div>

            {/* Far Right: Summary Data Table - Span 3 columns */}
            <div className="col-span-3 h-full">
                <PharmacieTable data={data.pharmacie} />
            </div>
        </div>
      </main>
    </div>
  );
}
