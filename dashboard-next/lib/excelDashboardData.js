const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const crypto = require('crypto');

function normalizeText(value) {
  return String(value ?? '').trim();
}

function normalizeKey(value) {
  return normalizeText(value)
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/'/g, '’');
}

function parseExcelDate(value) {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === 'number') return new Date(Math.round((value - 25569) * 86400 * 1000));
  const text = normalizeText(value);
  const parts = text.split('/');
  if (parts.length !== 3) return null;
  const day = Number(parts[0]);
  const month = Number(parts[1]) - 1;
  const year = Number(parts[2]);
  if (!Number.isFinite(day) || !Number.isFinite(month) || !Number.isFinite(year)) return null;
  const d = new Date(year, month, day);
  return Number.isNaN(d.getTime()) ? null : d;
}

function isResolvedStatus(value) {
  const s = normalizeText(value).toLowerCase();
  return (
    s.includes('résolu') ||
    s.includes('resolu') ||
    s.includes('clôt') ||
    s.includes('clos') ||
    s.includes('fermé') ||
    s.includes('ferme') ||
    s.includes('closed') ||
    s.includes('termin')
  );
}

function stableHashInt(input) {
  const b = crypto.createHash('sha256').update(input).digest();
  return b.readUInt32BE(0);
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

function findHeader(headers, candidates) {
  const map = new Map();
  headers.forEach((h) => map.set(normalizeKey(h), h));
  for (const c of candidates) {
    const found = map.get(normalizeKey(c));
    if (found) return found;
  }
  return null;
}

function toRowObject(rawRow, headerMap) {
  const get = (k) => rawRow[headerMap[k]];
  return {
    claimId: normalizeText(get('claimId')),
    anomalyType: normalizeText(get('anomalyType')),
    date: get('date'),
    status: normalizeText(get('status')),
    typologie: normalizeText(get('typologie')),
    service: normalizeText(get('service')),
    client: normalizeText(get('client')),
    ville: normalizeText(get('ville')),
    source: normalizeText(get('source')),
    intervenants: normalizeText(get('intervenants')),
    description: normalizeText(get('description')),
  };
}

function validateRows(rows) {
  const errors = [];
  let validCount = 0;
  const required = ['date', 'typologie', 'service', 'client', 'ville', 'status'];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const missing = required.filter((k) => !normalizeText(row[k]));
    const date = parseExcelDate(row.date);
    const hasDate = date && !Number.isNaN(date.getTime());

    if (missing.length > 0 || !hasDate) {
      errors.push({
        rowIndex: i + 2,
        missing,
        invalidDate: !hasDate,
      });
      continue;
    }
    validCount += 1;
  }

  return {
    validCount,
    invalidCount: rows.length - validCount,
    errors,
  };
}

function generateMockDashboardData(seed, availableYears) {
  const baseTypologies = [
    'Erreur de remise',
    'Retard de livraison',
    'Produit manquant',
    'Refus de livraison',
    'Demande d’information',
    'Erreur de facturation',
  ];
  const baseVilles = ['Rabat', 'Casablanca', 'Temara', 'Salé', 'Tanger', 'Marrakech', 'Agadir'];
  const pharmacies = [
    'Pharmacie Al Amal',
    'Pharmacie Al Wifaq',
    'Pharmacie Marjane',
    'Pharmacie Boraq',
    'Pharmacie Centrale',
    'Pharmacie Al Fath',
  ];
  const agents = ['Fatima', 'Hajar', 'Souad', 'Youssef', 'Imane', 'Omar', 'Nadia'];

  const rand = (tag) => stableHashInt(`${seed}|${tag}`);
  const pick = (arr, idx) => arr[idx % arr.length];

  const typologie = Array.from({ length: 6 }).map((_, i) => ({
    typologie: pick(baseTypologies, rand(`t-${i}`)),
    total: 10 + (rand(`tv-${i}`) % 60),
  }));

  typologie.sort((a, b) => b.total - a.total);

  const ville = Array.from({ length: 7 }).map((_, i) => ({
    ville: pick(baseVilles, rand(`v-${i}`)),
    total: 8 + (rand(`vv-${i}`) % 50),
  }));

  ville.sort((a, b) => b.total - a.total);

  const pharmacie = Array.from({ length: 6 }).map((_, i) => {
    const total_calls = 5 + (rand(`p-${i}`) % 40);
    const resolution_rate = round2(60 + (rand(`pr-${i}`) % 41));
    return {
      pharmacie_name: pharmacies[i],
      total_calls,
      resolution_rate,
    };
  });

  pharmacie.sort((a, b) => b.total_calls - a.total_calls);

  const agentVolume = agents.map((agent, i) => {
    const total = 20 + (rand(`a-${i}`) % 80);
    const ratio = 0.45 + (rand(`ar-${i}`) % 21) / 100;
    const inbound = Math.round(total * ratio);
    const outbound = Math.max(0, total - inbound);
    return { agent, inbound, outbound };
  });

  agentVolume.sort((a, b) => (b.inbound + b.outbound) - (a.inbound + a.outbound));

  const revenue = agentVolume.map((a) => {
    const multiplier = 150 + (rand(`rev-${a.agent}`) % 451);
    return { agent: a.agent, revenue: (a.inbound + a.outbound) * multiplier };
  });

  revenue.sort((a, b) => b.revenue - a.revenue);

  const totalVolume = typologie.reduce((acc, t) => acc + t.total, 0);
  const globalResolutionRate = 60 + (rand('grr') % 41);

  return {
    typologie,
    ville: ville.slice(0, 10),
    pharmacie: pharmacie.slice(0, 10),
    agentVolume: agentVolume.slice(0, 10),
    revenue: revenue.slice(0, 10),
    kpi: {
      totalVolume,
      globalResolutionRate,
      topIssue: typologie[0]?.typologie ?? 'N/A',
    },
    availableYears,
  };
}

function buildAggregates(rows, seed, availableYears) {
  const typologieMap = new Map();
  const villeMap = new Map();
  const pharmacieMap = new Map();
  const agentCounts = new Map();

  let totalVolume = 0;
  let resolved = 0;

  for (const r of rows) {
    totalVolume += 1;
    if (isResolvedStatus(r.status)) resolved += 1;

    const typ = normalizeText(r.typologie) || 'Unknown';
    typologieMap.set(typ, (typologieMap.get(typ) || 0) + 1);

    const ville = normalizeText(r.ville) || 'Unknown';
    villeMap.set(ville, (villeMap.get(ville) || 0) + 1);

    const pharmacie = normalizeText(r.client) || 'Unknown';
    const prev = pharmacieMap.get(pharmacie) || { total: 0, resolved: 0 };
    prev.total += 1;
    prev.resolved += isResolvedStatus(r.status) ? 1 : 0;
    pharmacieMap.set(pharmacie, prev);

    const agent =
      normalizeText(r.source) ||
      normalizeText(r.intervenants).split('\n')[0] ||
      'Agent';

    agentCounts.set(agent, (agentCounts.get(agent) || 0) + 1);
  }

  const typologie = Array.from(typologieMap.entries())
    .map(([typologie, total]) => ({ typologie, total }))
    .sort((a, b) => b.total - a.total);

  const ville = Array.from(villeMap.entries())
    .map(([ville, total]) => ({ ville, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  const pharmacie = Array.from(pharmacieMap.entries())
    .map(([pharmacie_name, stats]) => ({
      pharmacie_name,
      total_calls: stats.total,
      resolution_rate: stats.total > 0 ? round2((stats.resolved / stats.total) * 100) : 0,
    }))
    .sort((a, b) => b.total_calls - a.total_calls)
    .slice(0, 10);

  const agentVolume = Array.from(agentCounts.entries())
    .map(([agent, total]) => {
      const h = stableHashInt(`${seed}|agent|${agent}`);
      const ratio = 0.45 + (h % 21) / 100;
      const inbound = Math.round(total * ratio);
      const outbound = Math.max(0, total - inbound);
      return { agent, inbound, outbound };
    })
    .sort((a, b) => (b.inbound + b.outbound) - (a.inbound + a.outbound))
    .slice(0, 10);

  const revenue = agentVolume
    .map((a) => {
      const h = stableHashInt(`${seed}|revenue|${a.agent}`);
      const multiplier = 150 + (h % 451);
      return { agent: a.agent, revenue: (a.inbound + a.outbound) * multiplier };
    })
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  const globalResolutionRate = totalVolume > 0 ? Math.round((resolved / totalVolume) * 100) : 0;

  return {
    typologie,
    ville,
    pharmacie,
    agentVolume,
    revenue,
    kpi: {
      totalVolume,
      globalResolutionRate,
      topIssue: typologie[0]?.typologie ?? 'N/A',
    },
    availableYears,
  };
}

function getCache() {
  if (!globalThis.__excelDashboardCache) {
    globalThis.__excelDashboardCache = {
      fileMtimeMs: 0,
      loadedAtMs: 0,
      rows: [],
      availableYears: [],
      headerMap: null,
      validation: null,
    };
  }
  return globalThis.__excelDashboardCache;
}

function loadRowsFromExcel(excelPath) {
  const wb = XLSX.readFile(excelPath);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const headers = XLSX.utils.sheet_to_json(ws, { header: 1, range: 0, raw: false })[0] || [];

  const headerMap = {
    date: findHeader(headers, ['Date', 'date']),
    typologie: findHeader(headers, ['Typologie', 'typologie']),
    service: findHeader(headers, ['Services concernés', 'Service concerné', 'Service', 'service']),
    client: findHeader(headers, ['Client', 'Nom Officine', 'nomOfficine']),
    ville: findHeader(headers, ['Ville', 'ville']),
    status: findHeader(headers, ['Etat', 'Statut', 'Status', 'status']),
    source: findHeader(headers, ['Source', 'Source ']),
    intervenants: findHeader(headers, ['Intervenants (personnes ou rôles impliqués)', 'Intervenants']),
    description: findHeader(headers, ['Description', 'description']),
    claimId: findHeader(headers, ['ID', 'Id', 'Claim ID', 'Reclamation ID', 'Réclamation ID']),
    anomalyType: findHeader(headers, ['Anomalie', 'Type anomalie', 'Anomaly Type']),
  };

  const missingHeaders = Object.entries(headerMap)
    .filter(([, v]) => v == null)
    .map(([k]) => k);

  const data = XLSX.utils.sheet_to_json(ws, { raw: false });

  const rows = data.map((rawRow) => {
    const row = toRowObject(rawRow, headerMap);
    const dateObj = parseExcelDate(row.date);
    const claimId =
      row.claimId ||
      crypto
        .createHash('sha1')
        .update(
          [
            normalizeText(row.client),
            normalizeText(row.typologie),
            normalizeText(row.ville),
            normalizeText(row.status),
            dateObj ? dateObj.toISOString() : normalizeText(row.date),
            normalizeText(row.description),
          ].join('|')
        )
        .digest('hex');

    return {
      ...row,
      claimId,
      anomalyType: row.anomalyType || row.typologie || 'Anomalie',
      dateObj,
      serviceNorm: normalizeKey(row.service),
    };
  });

  const validation = validateRows(
    rows.map((r) => ({
      date: r.dateObj ?? r.date,
      typologie: r.typologie,
      service: r.service,
      client: r.client,
      ville: r.ville,
      status: r.status,
    }))
  );

  const availableYears = Array.from(
    new Set(rows.map((r) => (r.dateObj ? r.dateObj.getFullYear() : null)).filter((y) => typeof y === 'number'))
  ).sort((a, b) => b - a);

  return { rows, headerMap, missingHeaders, validation, availableYears };
}

function loadDashboardData(params) {
  const { year = 'All', month = 'All', excelPath, ttlMs = 30000 } = params || {};
  const resolvedExcelPath =
    excelPath || process.env.DASHBOARD_EXCEL_PATH || path.join(process.cwd(), 'Réclamations_Anomalies Suivi.xlsx');

  const cache = getCache();
  const now = Date.now();

  let stat;
  try {
    stat = fs.statSync(resolvedExcelPath);
  } catch (e) {
    const y = typeof year === 'string' && year !== 'All' ? Number(year) : new Date().getFullYear();
    const availableYears = [y];
    const seed = `mock|missing-file|${year}|${month}`;
    return {
      data: generateMockDashboardData(seed, availableYears),
      meta: { source: 'mock', reason: 'file-unavailable', excelPath: resolvedExcelPath, error: String(e?.message || e) },
    };
  }

  const mtimeMs = stat.mtimeMs || 0;
  const cacheValid = cache.fileMtimeMs === mtimeMs && now - cache.loadedAtMs < ttlMs && Array.isArray(cache.rows);

  if (!cacheValid) {
    try {
      const loaded = loadRowsFromExcel(resolvedExcelPath);
      cache.fileMtimeMs = mtimeMs;
      cache.loadedAtMs = now;
      cache.rows = loaded.rows;
      cache.availableYears = loaded.availableYears;
      cache.headerMap = loaded.headerMap;
      cache.validation = {
        missingHeaders: loaded.missingHeaders,
        validCount: loaded.validation.validCount,
        invalidCount: loaded.validation.invalidCount,
      };
    } catch (e) {
      const y = typeof year === 'string' && year !== 'All' ? Number(year) : new Date().getFullYear();
      const availableYears = [y];
      const seed = `mock|parse-failed|${year}|${month}`;
      return {
        data: generateMockDashboardData(seed, availableYears),
        meta: { source: 'mock', reason: 'parse-failed', excelPath: resolvedExcelPath, error: String(e?.message || e) },
      };
    }
  }

  const serviceKey = normalizeKey('Centre d’appel');
  const rows = cache.rows.filter((r) => r.serviceNorm === serviceKey && r.dateObj && !Number.isNaN(r.dateObj.getTime()));
  const years = cache.availableYears?.length ? cache.availableYears : Array.from(new Set(rows.map((r) => r.dateObj.getFullYear()))).sort((a, b) => b - a);

  const filtered = rows.filter((r) => {
    if (typeof year === 'string' && year !== 'All') {
      const y = Number(year);
      if (!Number.isFinite(y) || r.dateObj.getFullYear() !== y) return false;
      if (typeof month === 'string' && month !== 'All') {
        const m = Number(month);
        if (!Number.isFinite(m) || r.dateObj.getMonth() + 1 !== m) return false;
      }
    }
    return true;
  });

  const seed = `excel|${year}|${month}`;
  const validation = cache.validation || { missingHeaders: [], invalidCount: 0, validCount: rows.length };
  const missingCritical = (validation.missingHeaders || []).some((h) => ['date', 'typologie', 'service', 'client', 'ville', 'status'].includes(h));
  const invalidRatio = rows.length > 0 ? (validation.invalidCount || 0) / rows.length : 1;

  if (missingCritical || invalidRatio > 0.4) {
    const data = generateMockDashboardData(`mock|invalid-data|${year}|${month}`, years.length ? years : [new Date().getFullYear()]);
    return {
      data,
      meta: { source: 'mock', reason: 'invalid-or-missing-fields', excelPath: resolvedExcelPath, validation },
    };
  }

  if (filtered.length === 0) {
    const data = generateMockDashboardData(`mock|no-rows|${year}|${month}`, years.length ? years : [new Date().getFullYear()]);
    return {
      data,
      meta: { source: 'mock', reason: 'no-rows-for-filter', excelPath: resolvedExcelPath, validation },
    };
  }

  return {
    data: buildAggregates(filtered, seed, years),
    meta: { source: 'excel', excelPath: resolvedExcelPath, validation, rowCount: filtered.length },
  };
}

module.exports = {
  loadDashboardData,
  parseExcelDate,
  normalizeKey,
  validateRows,
  generateMockDashboardData,
};

