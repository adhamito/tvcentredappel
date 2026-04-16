import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { DashboardData } from '../types';

interface Props {
  data: DashboardData['agentVolume'];
}

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

const INBOUND_COLOR = '#14B8A6';
const OUTBOUND_COLOR = '#94A3B8';
const AXIS_COLOR = '#64748B';
const GRID_COLOR = '#E2E8F0';

function FlowTooltip({ active, payload, label }: TooltipContentProps) {
  if (!active || !payload || payload.length === 0) return null;
  const row = payload[0].payload as
    | { agent?: string; inbound?: number; outbound?: number }
    | undefined;
  if (!row) return null;
  const inbound = Number(row.inbound) || 0;
  const outbound = Number(row.outbound) || 0;
  const total = inbound + outbound;
  const inShare = total > 0 ? Math.round((inbound / total) * 100) : 0;
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-title">{row.agent ?? label}</div>
      <div className="chart-tooltip-row">
        <span className="label">
          <span className="dot" style={{ background: INBOUND_COLOR }} />
          Entrant
        </span>
        <span className="value">{inbound}</span>
      </div>
      <div className="chart-tooltip-row">
        <span className="label">
          <span className="dot" style={{ background: OUTBOUND_COLOR }} />
          Sortant
        </span>
        <span className="value">{outbound}</span>
      </div>
      <div className="chart-tooltip-sub">
        Total: <strong style={{ color: '#0F172A' }}>{total}</strong> · Entrant {inShare}%
      </div>
    </div>
  );
}

export default function StatusInOutChart({ data }: Props) {
  const chartData = data.map((d) => ({
    agent: d.agent,
    inbound: Math.abs(d.inbound),
    outbound: Math.abs(d.outbound),
    total: Math.abs(d.inbound) + Math.abs(d.outbound),
  }));

  return (
    <div className="dash-card p-4 flex flex-col h-full min-h-0">
      <h2 className="mb-3 text-xs font-semibold text-slate-700 shrink-0 flex items-center gap-2 uppercase tracking-wider">
        <span className="w-1 h-4 rounded-full bg-teal-500"></span>
        Flux Entrant / Sortant
      </h2>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} horizontal={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: AXIS_COLOR, fontWeight: 500 }}
              axisLine={{ stroke: GRID_COLOR }}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="agent"
              tick={{ fontSize: 11, fill: AXIS_COLOR, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              width={90}
            />
            <Tooltip
              cursor={{ fill: 'rgba(15,23,42,0.04)' }}
              content={<FlowTooltip />}
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
                <span style={{ color: AXIS_COLOR, marginLeft: '2px' }}>{value}</span>
              )}
            />
            <Bar
              dataKey="inbound"
              name="Entrant"
              stackId="flow"
              fill={INBOUND_COLOR}
              maxBarSize={22}
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="outbound"
              name="Sortant"
              stackId="flow"
              fill={OUTBOUND_COLOR}
              maxBarSize={22}
              radius={[0, 6, 6, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
