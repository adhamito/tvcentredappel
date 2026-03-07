import React from 'react';
import Image from 'next/image';

interface DashboardHeaderProps {
  selectedYear: string;
  onYearChange: (year: string) => void;
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  availableYears: number[];
}

const MONTHS = [
  { value: 'All', label: 'All Months' },
  { value: '1', label: 'Janvier' },
  { value: '2', label: 'Février' },
  { value: '3', label: 'Mars' },
  { value: '4', label: 'Avril' },
  { value: '5', label: 'Mai' },
  { value: '6', label: 'Juin' },
  { value: '7', label: 'Juillet' },
  { value: '8', label: 'Août' },
  { value: '9', label: 'Septembre' },
  { value: '10', label: 'Octobre' },
  { value: '11', label: 'Novembre' },
  { value: '12', label: 'Décembre' },
];

/**
 * The top header of the dashboard.
 * Displays the logo, title, a system operational status indicator, and filters.
 */
export default function DashboardHeader({
  selectedYear,
  onYearChange,
  selectedMonth,
  onMonthChange,
  availableYears,
}: DashboardHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6 shrink-0 px-4">
      <div className="flex items-center">
        <div className="relative w-40 h-12 mr-6 transition-transform hover:scale-105 duration-300">
            <Image src="/logo.png" alt="Logo" fill style={{ objectFit: 'contain' }} priority className="drop-shadow-sm" />
        </div>
        <div>
            <h1 className="text-3xl font-black text-[#0e677a] tracking-tighter uppercase drop-shadow-sm">
                Centre d&apos;Appel
            </h1>
            <p className="text-xs font-bold text-[#5a5a5a] tracking-[0.2em] uppercase mt-1 ml-1 opacity-80">
                Performance Dashboard
            </p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Year Filter */}
        <div className="relative">
          <select
            value={selectedYear}
            onChange={(e) => onYearChange(e.target.value)}
            className="appearance-none bg-white border border-slate-200 text-slate-700 py-2 pl-4 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0e677a] focus:border-transparent text-sm font-medium cursor-pointer"
          >
            <option value="All">All Years</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>

        {/* Month Filter */}
        <div className="relative">
          <select
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            disabled={selectedYear === 'All'}
            className={`appearance-none bg-white border border-slate-200 text-slate-700 py-2 pl-4 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0e677a] focus:border-transparent text-sm font-medium cursor-pointer ${
              selectedYear === 'All' ? 'opacity-50 cursor-not-allowed bg-slate-100' : ''
            }`}
          >
            {MONTHS.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-full shadow-sm border border-[#f0f2f5]">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-xs font-bold text-[#5a5a5a] uppercase tracking-widest">
              System Operational
          </span>
        </div>
      </div>
    </div>
  );
}
