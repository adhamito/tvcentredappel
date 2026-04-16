import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { DashboardData } from '../types';

interface TypologieChartProps {
  data: DashboardData['typologie'];
}

// Teal gradient scale (darkest → lightest) with gold accent reserved for the top entry.
const TEAL_SCALE = ['#0F766E', '#0D9488', '#14B8A6', '#2DD4BF', '#5EEAD4', '#99F6E4'];
const GOLD_ACCENT = '#F59E0B';

interface TooltipEntry {
  value?: number | string;
  name?: string;
  payload?: Record<string, unknown>;
}

interface TooltipContentProps {
  active?: boolean;
  payload?: TooltipEntry[];
}

function getCellColor(index: number, topIndex: number) {
  if (index === topIndex) return GOLD_ACCENT;
  const offset = index < topIndex ? index : index - 1;
  return TEAL_SCALE[offset % TEAL_SCALE.length];
}

function TypologieTooltip({
  active,
  payload,
  total,
}: TooltipContentProps & { total: number }) {
  if (!active || !payload || payload.length === 0) return null;
  const entry = payload[0];
  const raw = entry.payload as
    | { typologie?: string; total?: number; fill?: string }
    | undefined;
  const name = raw?.typologie ?? String(entry.name ?? '');
  const value = Number(raw?.total ?? entry.value) || 0;
  const share = total > 0 ? Math.round((value / total) * 100) : 0;
  const color = raw?.fill || TEAL_SCALE[1];
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-title">{name}</div>
      <div className="chart-tooltip-row">
        <span className="label">
          <span className="dot" style={{ background: color }} />
          Appels
        </span>
        <span className="value">{value}</span>
      </div>
      <div className="chart-tooltip-row">
        <span className="label">Part</span>
        <span className="value">{share}%</span>
      </div>
      <div className="chart-tooltip-sub">Total toutes typologies: {total}</div>
    </div>
  );
}

export default function TypologieChart({ data }: TypologieChartProps) {
  const total = data.reduce((s, d) => s + (d.total ?? 0), 0);
  const topIndex = data.reduce(
    (best, d, i) => (d.total > (data[best]?.total ?? -Infinity) ? i : best),
    0
  );
  const topEntry = data[topIndex];
  const topShare = total > 0 ? Math.round(((topEntry?.total ?? 0) / total) * 100) : 0;

  return (
    <div className="dash-card p-4 flex flex-col h-full min-h-0">
      <h2 className="mb-3 text-xs font-semibold text-slate-700 shrink-0 flex items-center gap-2 uppercase tracking-wider">
        <span className="w-1 h-4 rounded-full bg-teal-500"></span>
        Typologie
      </h2>

      <div className="flex-1 w-full min-h-0 flex items-center gap-3">
        <div className="flex-1 min-w-0 h-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<TypologieTooltip total={total} />} />
              <Pie
                data={data}
                dataKey="total"
                nameKey="typologie"
                cx="50%"
                cy="50%"
                innerRadius="58%"
                outerRadius="92%"
                paddingAngle={2}
                stroke="#FFFFFF"
                strokeWidth={2}
                isAnimationActive
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={getCellColor(i, topIndex)} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {topEntry && (
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                Top typologie
              </span>
              <span className="text-sm font-bold text-slate-900 truncate max-w-[70%]">
                {topEntry.typologie}
              </span>
              <span className="text-[11px] text-slate-500 tabular-nums">
                {topEntry.total} · {topShare}%
              </span>
            </div>
          )}
        </div>

        <ul
          className="shrink-0 flex flex-col gap-1 pr-1 overflow-hidden"
          style={{ minWidth: 120 }}
        >
          {data.map((d, i) => {
            const share = total > 0 ? Math.round((d.total / total) * 100) : 0;
            return (
              <li
                key={d.typologie}
                className="flex items-center justify-between gap-3 text-[11px]"
              >
                <span className="flex items-center gap-1.5 min-w-0">
                  <span
                    className="inline-block w-2 h-2 rounded-full shrink-0"
                    style={{ background: getCellColor(i, topIndex) }}
                  />
                  <span className="text-slate-700 font-medium truncate">
                    {d.typologie}
                  </span>
                </span>
                <span className="text-slate-500 tabular-nums shrink-0">{share}%</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
