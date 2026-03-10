import { NextApiRequest, NextApiResponse } from 'next';
import { Prisma } from '@prisma/client';
import prisma from '../../lib/prisma';
import { ReclamationsResponse } from '../../types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ReclamationsResponse | { message: string } | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { search = '', page = '1', limit = '10', year, month } = req.query;
  const pageNum = parseInt(page as string, 10) || 1;
  const limitNum = parseInt(limit as string, 10) || 10;
  const skip = (pageNum - 1) * limitNum;
  
  let dateFilter: Prisma.reclamationsWhereInput = {};
  if (year && typeof year === 'string' && year !== 'All') {
    const yearNum = parseInt(year);
    let startDate, endDate;
    if (month && typeof month === 'string' && month !== 'All') {
      const monthNum = parseInt(month);
      startDate = new Date(Date.UTC(yearNum, monthNum - 1, 1));
      endDate = new Date(Date.UTC(yearNum, monthNum, 1));
    } else {
      startDate = new Date(Date.UTC(yearNum, 0, 1));
      endDate = new Date(Date.UTC(yearNum + 1, 0, 1));
    }
    dateFilter = {
      dateReclamation: {
        gte: startDate,
        lt: endDate,
      }
    };
  }

  const searchQuery = search ? {
    OR: [
      { typologie: { contains: search as string, mode: 'insensitive' as const } },
      { nomOfficine: { contains: search as string, mode: 'insensitive' as const } },
      { ville: { contains: search as string, mode: 'insensitive' as const } },
      { description: { contains: search as string, mode: 'insensitive' as const } },
    ]
  } : {};

  try {
    const [total, data] = await Promise.all([
      prisma.reclamations.count({
        where: {
          serviceConcerne: 'Centre d’appel',
          ...searchQuery,
          ...dateFilter,
        },
      }),
      prisma.reclamations.findMany({
        where: {
          serviceConcerne: 'Centre d’appel',
          ...searchQuery,
          ...dateFilter,
        },
        orderBy: {
          dateReclamation: 'desc',
        },
        skip,
        take: limitNum,
        select: {
          id: true,
          dateReclamation: true,
          nomOfficine: true,
          typologie: true,
          ville: true,
          status: true,
          cloture: true,
        }
      }),
    ]);

    const formattedData = data.map(item => ({
      ...item,
      dateReclamation: item.dateReclamation.toISOString(),
      cloture: item.cloture ?? false,
    }));

    res.status(200).json({
      data: formattedData,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching reclamations:', error);
    res.status(500).json({ error: 'Failed to fetch reclamations' });
  }
}
