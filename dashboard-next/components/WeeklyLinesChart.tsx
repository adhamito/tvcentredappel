import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { DashboardData } from '../types';

interface Props {
  weeks: NonNullable<DashboardData['weekly']>['weeks'];
  lines: NonNullable<DashboardData['weekly']>['linesPerWeek'];
}

interface TooltipEntry {
  value?: number | string;
  name?: string;
  dataKey?: string | number;
  color?: string;
}

interface TooltipContentProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string | number;
}

function LinesTooltip({
  active,
  payload,
  label,
  totalSum,
  avg,
}: TooltipContentProps & { totalSum: number; avg: number }) {
  if (!active || !payload || payload.length === 0) return null;
  const value = Number(payload[0].value) || 0;
  const share = totalSum > 0 ? Math.round((value / totalSum) * 100) : 0;
  const delta = avg > 0 ? Math.round(((value - avg) / avg) * 100) : 0;
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-title">Semaine {label}</div>
      <div className="chart-tooltip-row">
        <span className="label">
          <span className="dot" style={{ background: '#6366F1' }} />
          Lignes
        </span>
        <span className="value">{value}</span>
      </div>
      <div className="chart-tooltip-row">
        <span className="label">Part du total</span>
        <span className="value">{share}%</span>
      </div>
      <div className="chart-tooltip-sub">
        {delta >= 0 ? '▲' : '▼'} {Math.abs(delta)}% vs. moyenne ({Math.round(avg)})
      </div>
    </div>
  );
}

export default function WeeklyLinesChart({ weeks, lines }: Props) {
  const data = weeks.map((w, idx) => ({ week: w, lines: lines[idx] ?? 0 }));
  const totalSum = lines.reduce((s, v) => s + (v ?? 0), 0);
  const avg = lines.length > 0 ? totalSum / lines.length : 0;

  return (
    <div className="dash-card p-4 flex flex-col h-full min-h-0">
      <h2 className="mb-3 text-xs font-semibold text-slate-700 shrink-0 flex items-center gap-2 uppercase tracking-wider">
        <span className="w-1 h-4 rounded-full bg-indigo-400"></span>
        Lignes par Semaine
      </h2>
      <div className="flex-1 min-h-0 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 15, left: 5, bottom: 10 }}>
            <defs>
              <linearGradient id="linesAreaFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366F1" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#6366F1" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
            <XAxis
              dataKey="week"
              tick={{ fontSize: 11, fill: '#64748B', fontWeight: 500 }}
              axisLine={{ stroke: '#E2E8F0' }}
              tickLine={false}
              dy={6}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#64748B', fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              dx={-5}
            />
            <Tooltip
              cursor={{ stroke: '#CBD5E1', strokeWidth: 1, strokeDasharray: '3 3' }}
              content={<LinesTooltip totalSum={totalSum} avg={avg} />}
            />
            <Area
              type="monotone"
              dataKey="lines"
              stroke="#6366F1"
              strokeWidth={2.5}
              fill="url(#linesAreaFill)"
              dot={{ r: 3, fill: '#FFFFFF', strokeWidth: 2, stroke: '#6366F1' }}
              activeDot={{ r: 6, stroke: '#6366F1', strokeWidth: 2, fill: '#FFFFFF' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
