import type { NextApiRequest, NextApiResponse } from 'next';
import { Prisma } from '@prisma/client';
import prisma from '../../lib/prisma';
import { DashboardData } from '../../types';
import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DashboardData | { error: string }>
) {
  try {
    const { year, month } = req.query;

    const dataFilePath = path.join(process.cwd(), 'public', 'dashboardData.json');
    try {
      const raw = await fs.readFile(dataFilePath, 'utf8');
      const json = JSON.parse(raw) as {
        availableYears?: number[];
        periods?: Record<string, Record<string, DashboardData>>;
      };

      const yearKey = typeof year === 'string' ? year : 'All';
      const monthKey = typeof month === 'string' ? month : 'All';

      const selected =
        yearKey === 'All'
          ? json.periods?.All?.All
          : monthKey === 'All'
            ? json.periods?.[yearKey]?.All
            : json.periods?.[yearKey]?.[monthKey];

      if (selected) {
        res.status(200).json({
          ...selected,
          availableYears: json.availableYears ?? selected.availableYears ?? [],
        });
        return;
      }
    } catch {}

    let dateFilter: Prisma.reclamationsWhereInput = {};
    let dateFilterRaw = Prisma.empty;

    if (year && typeof year === 'string' && year !== 'All') {
      const yearNum = parseInt(year);
      let startDate, endDate;

      if (month && typeof month === 'string' && month !== 'All') {
        const monthNum = parseInt(month);
        // month is 1-based from UI usually
        startDate = new Date(Date.UTC(yearNum, monthNum - 1, 1));
        // End date is start of next month
        endDate = new Date(Date.UTC(yearNum, monthNum, 1));
      } else {
        startDate = new Date(Date.UTC(yearNum, 0, 1));
        endDate = new Date(Date.UTC(yearNum + 1, 0, 1));
      }

      dateFilter = {
        dateReclamation: {
          gte: startDate,
          lt: endDate,
        },
      };

      dateFilterRaw = Prisma.sql`AND "dateReclamation" >= ${startDate} AND "dateReclamation" < ${endDate}`;
    }

    const commonWhere = {
      serviceConcerne: 'Centre d’appel',
      ...dateFilter,
    };

    // 1. Typologie (Call Categorization)
    const typologieData = await prisma.reclamations.groupBy({
      by: ['typologie'],
      where: commonWhere,
      _count: {
        _all: true,
      },
      orderBy: {
        _count: {
          typologie: 'desc',
        },
      },
    });

    const typologie = typologieData.map((item) => ({
      typologie: item.typologie || 'Unknown',
      total: item._count._all,
    }));

    // 2. Performance par Ville (Location Stats)
    const villeData = await prisma.reclamations.groupBy({
      by: ['ville'],
      where: commonWhere,
      _count: {
        _all: true,
      },
      orderBy: {
        _count: {
          ville: 'desc',
        },
      },
      take: 10,
    });

    const ville = villeData.map((item) => ({
      ville: item.ville || 'Unknown',
      total: item._count._all,
    }));

    // 3. Pharmacie & Taux de Résolution (KPI Table)
    const pharmacieRaw = await prisma.$queryRaw`
      SELECT 
        "nomOfficine" as pharmacie_name, 
        COUNT(*) as total_calls,
        ROUND(CAST(SUM(CASE WHEN cloture = true THEN 1 ELSE 0 END) AS NUMERIC) / COUNT(*) * 100, 2) as resolution_rate
      FROM "reclamations"
      WHERE "serviceConcerne" = 'Centre d’appel'
      ${dateFilterRaw}
      GROUP BY "nomOfficine"
      ORDER BY total_calls DESC
      LIMIT 10;
    `;

    // Serialize BigInt if any (COUNT returns BigInt in raw queries often)
    const pharmacie = (pharmacieRaw as { pharmacie_name: string; total_calls: bigint; resolution_rate: number }[]).map(p => ({
      pharmacie_name: p.pharmacie_name,
      total_calls: Number(p.total_calls),
      resolution_rate: Number(p.resolution_rate),
    }));

    // 4. KPI Cards
    const totalVolume = await prisma.reclamations.count({
      where: commonWhere,
    });

    const resolvedVolume = await prisma.reclamations.count({
      where: {
        ...commonWhere,
        cloture: true,
      },
    });

    const globalResolutionRate = totalVolume > 0 ? Math.round((resolvedVolume / totalVolume) * 100) : 0;

    const topIssue = typologieData.length > 0 ? (typologieData[0].typologie || 'N/A') : 'N/A';

    // 5. Get available years for filtering
    // We use a raw query to get distinct years efficiently
    const yearsResult = await prisma.$queryRaw<{ year: number }[]>`
      SELECT DISTINCT EXTRACT(YEAR FROM "dateReclamation") as year 
      FROM "reclamations" 
      WHERE "serviceConcerne" = 'Centre d’appel'
      ORDER BY year DESC
    `;
    
    const availableYears = yearsResult.map(y => Number(y.year)).filter(y => !isNaN(y));

    res.status(200).json({
      typologie,
      ville,
      pharmacie,
      agentVolume: [],
      revenue: [],
      kpi: {
        totalVolume,
        globalResolutionRate,
        topIssue,
      },
      availableYears,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
