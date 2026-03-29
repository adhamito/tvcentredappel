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

  /** Call volume by agent (Inbound vs Outbound). */
  agentVolume: { agent: string; inbound: number; outbound: number }[];

  /** Revenue per collaborator (Leaderboard). */
  revenue: { agent: string; revenue: number }[];
  
  /** Key Performance Indicators for the hero section. */
  kpi: {
    totalVolume: number;
    globalResolutionRate: number;
    topIssue: string;
  };
  
  /** Available years for filtering */
  availableYears: number[];

  availableServices?: string[];

  /** Weekly-focused metrics for productivity and logistics */
  weekly?: {
    /** Week labels for the current filter scope (e.g., W1…W5) */
    weeks: string[];
    /** Per-collaborator BL volume series aligned with weeks */
    volumeByAgent: { agent: string; series: number[] }[];
    /** Lines processed per week aligned with weeks */
    linesPerWeek: number[];
    /** In/Out status per week */
    statusInOut: { week: string; inbound: number; outbound: number }[];
    /** Total complaints in the filtered period */
    complaintsCount: number;
    /** Injection/input count proxy */
    injCount: number;

    openCount?: number;
    highUrgencyCount?: number;
  };

  recent?: {
    id: string;
    date: string;
    source: string;
    typologie: string;
    client: string;
    ville: string;
    status: string;
    urgence: string;
    agentName?: string;
    duration?: string;
  }[];
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
  urgence?: string;
  source?: string;
  agentName?: string;
  duration?: string;
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
