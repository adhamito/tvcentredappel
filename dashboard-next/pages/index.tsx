import Head from 'next/head';
import useSWR from 'swr';
import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Activity, Calendar, Filter } from 'lucide-react';
import WeeklyVolumeByAgent from '../components/WeeklyVolumeByAgent';
import WeeklyLinesChart from '../components/WeeklyLinesChart';
import StatusInOutChart from '../components/StatusInOutChart';
import TypologieChart from '../components/TypologieChart';
import ReclamationsCard from '../components/ReclamationsCard';
import InjectionCard from '../components/InjectionCard';
import KPICards from '../components/KPICards';
import { DashboardData } from '../types';
import { fetcher } from '../utils/helpers';

type QuickFilter = 'week' | 'month' | 'team';

const FILTERS: { id: QuickFilter; label: string }[] = [
  { id: 'week', label: 'This Week' },
  { id: 'month', label: 'Last Month' },
  { id: 'team', label: 'By Team' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const blockVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

function formatRelative(from: Date, to: Date): string {
  const diffMs = to.getTime() - from.getTime();
  const diffSec = Math.max(0, Math.floor(diffMs / 1000));
  if (diffSec < 10) return 'just now';
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
  const diffHr = Math.floor(diffMin / 60);
  return `${diffHr}h ago`;
}

export default function Home() {
  const now = new Date();
  const [activeFilter, setActiveFilter] = useState<QuickFilter>('week');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [tick, setTick] = useState(0);

  const { data, error } = useSWR<DashboardData>(
    `/api/dashboard?service=${encodeURIComponent('Centre d\'appel')}&year=All&month=All`,
    fetcher,
    {
      refreshInterval: 60000,
      onSuccess: () => setLastUpdated(new Date()),
    }
  );

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 15000);
    return () => clearInterval(id);
  }, []);

  const relative = useMemo(
    () => formatRelative(lastUpdated, new Date()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lastUpdated, tick]
  );

  const formattedDate = now.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (error) return (
    <div className="flex h-screen w-full items-center justify-center text-red-600 font-semibold text-lg">
      Failed to load dashboard data.
    </div>
  );

  if (!data) return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2 className="animate-spin text-teal-600" size={48} />
    </div>
  );

  return (
    <div className="h-screen w-full p-3 font-sans text-slate-800 flex flex-col overflow-hidden">
      <Head>
        <title>Centre d&apos;Appel — Dashboard</title>
        <meta name="description" content="Real-time call center performance metrics" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <motion.main
        className="w-full flex flex-col h-full gap-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* ─── Header Bar ─── */}
        <motion.header
          variants={blockVariants}
          className="flex items-center justify-between px-4 py-2.5 dash-card shrink-0"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 tracking-tight leading-none">
                Centre d&apos;Appel
              </h1>
              <p className="text-[11px] text-slate-500 mt-0.5">Tableau de bord en temps réel</p>
            </div>
          </div>

          {/* Quick filter chips */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`chip ${activeFilter === f.id ? 'chip-active' : ''}`}
                type="button"
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 live-dot"></span>
                Live
              </div>
              <span className="text-[11px] text-slate-400">•</span>
              <span className="text-[11px] text-slate-500" title={lastUpdated.toLocaleTimeString('fr-FR')}>
                Last updated: {relative}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Calendar className="w-3.5 h-3.5" />
              <span className="capitalize">{formattedDate}</span>
            </div>
          </div>
        </motion.header>

        {/* ─── KPI Row ─── */}
        <motion.div variants={blockVariants} className="shrink-0">
          <KPICards data={data.kpi} />
        </motion.div>

        {/* ─── Charts Grid ─── */}
        <div className="flex-1 grid grid-cols-12 grid-rows-2 gap-3 min-h-0 overflow-hidden">
          {/* Row 1 */}
          <motion.div variants={blockVariants} className="col-span-7 row-span-1 min-h-0">
            <WeeklyVolumeByAgent
              weeks={data.weekly?.weeks || []}
              series={data.weekly?.volumeByAgent || []}
            />
          </motion.div>
          <motion.div variants={blockVariants} className="col-span-3 row-span-1 min-h-0">
            <TypologieChart data={data.typologie} />
          </motion.div>
          <motion.div
            variants={blockVariants}
            className="col-span-2 row-span-1 min-h-0 flex flex-col gap-3"
          >
            <div className="flex-1 min-h-0">
              <ReclamationsCard
                total={data.weekly?.complaintsCount || data.kpi.totalVolume}
                open={data.weekly?.openCount || 0}
                highUrgency={data.weekly?.highUrgencyCount || 0}
              />
            </div>
            <div className="flex-1 min-h-0">
              <InjectionCard count={data.weekly?.injCount || 0} />
            </div>
          </motion.div>

          {/* Row 2 */}
          <motion.div variants={blockVariants} className="col-span-5 row-span-1 min-h-0">
            <WeeklyLinesChart
              weeks={data.weekly?.weeks || []}
              lines={data.weekly?.linesPerWeek || []}
            />
          </motion.div>
          <motion.div variants={blockVariants} className="col-span-7 row-span-1 min-h-0">
            <StatusInOutChart data={data.agentVolume || []} />
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
}
