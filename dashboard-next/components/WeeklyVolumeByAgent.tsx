import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { DashboardData } from '../types';

interface Props {
  weeks: NonNullable<DashboardData['weekly']>['weeks'];
  series: NonNullable<DashboardData['weekly']>['volumeByAgent'];
}

const COLORS = ['#0D9488', '#6366F1', '#10B981', '#F59E0B', '#EF4444'];

type Totals = Record<string, number>;

interface TooltipEntry {
  value?: number | string;
  name?: string;
  dataKey?: string | number;
  color?: string;
  payload?: Record<string, unknown>;
}

interface TooltipContentProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string | number;
}

function AgentTooltip({
  active,
  payload,
  label,
  totals,
}: TooltipContentProps & { totals: Totals }) {
  if (!active || !payload || payload.length === 0) return null;

  const weekTotal = payload.reduce(
    (sum: number, p: TooltipEntry) => sum + (Number(p.value) || 0),
    0
  );
  const sorted = [...payload].sort(
    (a, b) => (Number(b.value) || 0) - (Number(a.value) || 0)
  );

  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-title">Semaine {label}</div>
      {sorted.map((p) => {
        const value = Number(p.value) || 0;
        const share = weekTotal > 0 ? Math.round((value / weekTotal) * 100) : 0;
        return (
          <div key={String(p.dataKey)} className="chart-tooltip-row">
            <span className="label">
              <span className="dot" style={{ background: p.color }} />
              {p.name}
            </span>
            <span className="value">
              {value} call{value === 1 ? '' : 's'} · {share}%
            </span>
          </div>
        );
      })}
      <div className="chart-tooltip-sub">
        Total semaine: <strong style={{ color: '#0F172A' }}>{weekTotal}</strong>
        {sorted[0] && (
          <> · Leader: {sorted[0].name} ({totals[String(sorted[0].dataKey)] ?? 0} cumulés)</>
        )}
      </div>
    </div>
  );
}

export default function WeeklyVolumeByAgent({ weeks, series }: Props) {
  const data = weeks.map((w, idx) => {
    const row: Record<string, number | string> = { week: w };
    series.forEach((s) => {
      row[s.agent] = s.series[idx] ?? 0;
    });
    return row;
  });

  const totals: Totals = series.reduce<Totals>((acc, s) => {
    acc[s.agent] = s.series.reduce((sum, v) => sum + (v ?? 0), 0);
    return acc;
  }, {});

  const topSeries = series.slice(0, 5);

  return (
    <div className="dash-card p-4 flex flex-col h-full min-h-0">
      <h2 className="mb-3 text-xs font-semibold text-slate-700 shrink-0 flex items-center gap-2 uppercase tracking-wider">
        <span className="w-1 h-4 rounded-full bg-teal-500"></span>
        Volume par Collaborateur
      </h2>
      <div className="flex-1 min-h-0 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 15, left: 5, bottom: 10 }}>
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
              content={<AgentTooltip totals={totals} />}
            />
            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{
                fontSize: '0.65rem',
                fontWeight: 600,
                paddingBottom: '8px',
              }}
              iconType="circle"
              iconSize={7}
              formatter={(value: string) => (
                <span style={{ color: '#64748B', marginLeft: '2px' }}>{value}</span>
              )}
            />
            {topSeries.map((s, i) => {
              const color = COLORS[i % COLORS.length];
              return (
                <Line
                  key={s.agent}
                  type="monotone"
                  dataKey={s.agent}
                  stroke={color}
                  strokeWidth={2.25}
                  dot={{ r: 2.5, fill: '#FFFFFF', strokeWidth: 2, stroke: color }}
                  activeDot={{ r: 5, stroke: color, strokeWidth: 2, fill: '#FFFFFF' }}
                  animationDuration={900}
                  animationEasing="ease-out"
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
