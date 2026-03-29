import type { NextApiRequest, NextApiResponse } from 'next';
import { DashboardData } from '../../types';
import excelDashboardData from '../../lib/excelDashboardData';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DashboardData | { error: string }>
) {
  try {
    const { year, month, service } = req.query;
    const yearKey = typeof year === 'string' ? year : 'All';
    const monthKey = typeof month === 'string' ? month : 'All';
    const serviceKey = typeof service === 'string' ? service : 'Centre d’appel';

    const result = excelDashboardData.loadDashboardData({
      service: serviceKey,
      year: yearKey,
      month: monthKey,
      ttlMs: 60000,
    }) as { data: DashboardData; meta: unknown };

    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=30, stale-while-revalidate=60');
    res.status(200).json(result.data);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
