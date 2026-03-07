/**
 * Represents the main data structure returned by the dashboard API.
 * Contains aggregated metrics for different sections of the dashboard.
 */
export interface DashboardData {
  /** Aggregated count of calls by typology (category). */
  typologie: { typologie: string; total: number }[];
  
  /** Aggregated count of calls by city. */
  ville: { ville: string; total: number }[];
  
  /** Aggregated call statistics per pharmacy. */
  pharmacie: { pharmacie_name: string; total_calls: number; resolution_rate: number }[];
  
  /** Key Performance Indicators for the hero section. */
  kpi: {
    totalVolume: number;
    globalResolutionRate: number;
    topIssue: string;
  };
  
  /** Available years for filtering */
  availableYears: number[];
}

/**
 * Represents a single reclamation (claim/ticket) record.
 * Maps to the database schema for the reclamations table.
 */
export interface Reclamation {
  id: string;
  dateReclamation: string; // ISO Date string
  nomOfficine: string;
  typologie: string;
  ville: string;
  status: string;
  cloture: boolean;
}

/**
 * API response structure for the paginated reclamations list.
 */
export interface ReclamationsResponse {
  data: Reclamation[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
