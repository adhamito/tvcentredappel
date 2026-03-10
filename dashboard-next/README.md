This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.

## Dashboard data integration (Excel)

The dashboard reads claim/anomaly tracking data from:

`Réclamations_Anomalies Suivi.xlsx`

Data is loaded server-side in the dashboard API route and aggregated into the schema returned by `/api/dashboard`.

### Excel format expectations

The parser reads the first sheet and expects a header row. It supports these columns (French names are the typical ones in the provided file):

- Date (required): `Date` in `dd/mm/yyyy` format
- Service (required): `Services concernés`
- Typology (required): `Typologie`
- Pharmacy/client (required): `Client`
- City (required): `Ville`
- Status (required): `Etat` (used to compute resolution rate)
- Optional agent fields: `Source` / `Source `, `Intervenants (personnes ou rôles impliqués)`
- Optional anomaly fields: `Anomalie` / `Type anomalie`
- Optional claim id fields: `ID` / `Claim ID` / `Reclamation ID`

### Mapping rules

- The dashboard filters to `Services concernés = Centre d’appel` (normalized trim/case/spacing).
- KPI total volume is the number of filtered rows for the selected period (year/month).
- Global resolution rate is computed from the `Etat` column by matching “Résolu/Clôturé/Fermé/Closed”.
- The pharmacy table groups by `Client` and computes per-pharmacy resolution rate the same way.
- Agent volume and revenue are derived from the Excel rows:
  - Agent name is taken from `Source` (or the first line of `Intervenants…`).
  - Inbound/outbound split is generated deterministically from a stable hash (so charts are stable across refreshes).
  - Revenue is generated deterministically from agent volume and a stable multiplier.

### Validation

The loader validates each row for required fields and a valid date. If a significant share of rows is invalid, or required columns are missing, the API returns mock data instead.

### Fallback/mock generation

Mock data is returned when:

- The Excel file is missing/unreadable
- The workbook is corrupted or parsing fails
- Required columns are missing, or too many rows are invalid
- There are no matching rows for the current filter

Mock data matches the API schema and uses stable hashing to remain consistent across refreshes.

### Caching

Excel reads are cached in-memory in the server process using:

- file modification time (mtime) + a TTL (default 60s in `/api/dashboard`)

This reduces repeated file reads while keeping data reasonably fresh.

### Configuration

- `DASHBOARD_EXCEL_PATH` (optional): override the Excel file path.

### Implementation reference

- Loader: `lib/excelDashboardData.js`
- API route: `pages/api/dashboard.ts`
