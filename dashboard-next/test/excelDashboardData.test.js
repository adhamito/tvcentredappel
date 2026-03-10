const test = require('node:test');
const assert = require('node:assert/strict');
const os = require('node:os');
const path = require('node:path');
const fs = require('node:fs');
const XLSX = require('xlsx');

const { loadDashboardData } = require('../lib/excelDashboardData');

function writeTempWorkbook(rows) {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  const filePath = path.join(os.tmpdir(), `dashboard_excel_${Date.now()}_${Math.random().toString(16).slice(2)}.xlsx`);
  XLSX.writeFile(wb, filePath);
  return filePath;
}

test('loads Excel and aggregates by typology/city/pharmacy for month filter', () => {
  const excelPath = writeTempWorkbook([
    {
      Date: '10/03/2026',
      Typologie: 'Erreur de remise',
      'Services concernés': "Centre d’appel",
      Client: 'Pharmacie A',
      Ville: 'Rabat',
      Etat: 'Résolu',
      'Source ': 'Fatima',
    },
    {
      Date: '11/03/2026',
      Typologie: 'Erreur de remise',
      'Services concernés': "Centre d’appel",
      Client: 'Pharmacie A',
      Ville: 'Rabat',
      Etat: 'En cours',
      'Source ': 'Fatima',
    },
    {
      Date: '01/04/2026',
      Typologie: 'Retard de livraison',
      'Services concernés': "Centre d’appel",
      Client: 'Pharmacie B',
      Ville: 'Casablanca',
      Etat: 'Résolu',
      'Source ': 'Hajar',
    },
    {
      Date: '12/03/2026',
      Typologie: 'Produit manquant',
      'Services concernés': 'Autre service',
      Client: 'Pharmacie C',
      Ville: 'Rabat',
      Etat: 'Résolu',
      'Source ': 'Souad',
    },
  ]);

  try {
    const { data, meta } = loadDashboardData({ excelPath, year: '2026', month: '3', ttlMs: 0 });
    assert.equal(meta.source, 'excel');
    assert.equal(data.kpi.totalVolume, 2);
    assert.deepEqual(data.typologie, [{ typologie: 'Erreur de remise', total: 2 }]);
    assert.deepEqual(data.ville, [{ ville: 'Rabat', total: 2 }]);
    assert.deepEqual(data.pharmacie, [{ pharmacie_name: 'Pharmacie A', total_calls: 2, resolution_rate: 50 }]);
    assert.ok(Array.isArray(data.agentVolume));
    assert.ok(Array.isArray(data.revenue));
    assert.deepEqual(data.availableYears, [2026]);
  } finally {
    fs.unlinkSync(excelPath);
  }
});

test('falls back to mock when Excel file is missing', () => {
  const { data, meta } = loadDashboardData({ excelPath: 'Z:/does-not-exist.xlsx', year: '2026', month: '3', ttlMs: 0 });
  assert.equal(meta.source, 'mock');
  assert.ok(typeof meta.reason === 'string');
  assert.ok(Array.isArray(data.typologie));
  assert.ok(Array.isArray(data.ville));
  assert.ok(Array.isArray(data.pharmacie));
  assert.ok(Array.isArray(data.agentVolume));
  assert.ok(Array.isArray(data.revenue));
  assert.ok(Array.isArray(data.availableYears));
});

test('falls back to mock when required columns are missing', () => {
  const excelPath = writeTempWorkbook([
    {
      Date: '10/03/2026',
      'Services concernés': "Centre d’appel",
      Client: 'Pharmacie A',
      Ville: 'Rabat',
      Etat: 'Résolu',
    },
  ]);

  try {
    const { data, meta } = loadDashboardData({ excelPath, year: '2026', month: '3', ttlMs: 0 });
    assert.equal(meta.source, 'mock');
    assert.equal(meta.reason, 'invalid-or-missing-fields');
    assert.ok(data.kpi.totalVolume > 0);
  } finally {
    fs.unlinkSync(excelPath);
  }
});

