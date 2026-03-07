import { useState } from 'react';
import Head from 'next/head';
import useSWR from 'swr';
import { Loader2 } from 'lucide-react';
import DashboardHeader from '../components/DashboardHeader';
import KPICards from '../components/KPICards';
import TypologieChart from '../components/TypologieChart';
import VilleChart from '../components/VilleChart';
import PharmacieTable from '../components/PharmacieTable';
import ReclamationsList from '../components/ReclamationsList';
import { DashboardData, ReclamationsResponse } from '../types';
import { fetcher } from '../utils/helpers';

export default function Home() {
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState('All');

  const { data, error, isLoading } = useSWR<DashboardData>(
    `/api/dashboard?year=${selectedYear}&month=${selectedMonth}`, 
    fetcher, 
    {
      refreshInterval: 60000, // Auto-refresh every 60 seconds
    }
  );

  const { data: recData, isLoading: recLoading } = useSWR<ReclamationsResponse>(
    `/api/reclamations?limit=50&year=${selectedYear}&month=${selectedMonth}`,
    fetcher,
    { refreshInterval: 10000 }
  );

  const isFiltered = selectedYear !== 'All';

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
        <title>Centre d&apos;Appel Dashboard</title>
        <meta name="description" content="Real-time performance metrics" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-[1920px] mx-auto w-full flex flex-col h-full">
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
        
        <KPICards data={data.kpi} isFiltered={isFiltered} />

        <div className="grid grid-cols-3 gap-6 flex-1 min-h-0 w-[98%] mx-auto pb-6">
            {/* Row 1: Charts & Tables */}
            <TypologieChart data={data.typologie} />
            <VilleChart data={data.ville} />
            <PharmacieTable data={data.pharmacie} />

            {/* Row 2: Detailed Reclamations List */}
            <div className="col-span-3 flex flex-col h-full min-h-0">
                <ReclamationsList data={recData?.data || []} isLoading={recLoading} isFiltered={isFiltered} />
            </div>
        </div>
      </main>
    </div>
  );
}
