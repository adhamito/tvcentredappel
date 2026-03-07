import { Tag, PhoneOff, AlertCircle } from 'lucide-react';

/**
 * Custom fetcher for SWR to handle API requests.
 * @param url - The API endpoint URL.
 * @returns A promise resolving to the JSON response.
 */
export const fetcher = (url: string) => fetch(url).then((res) => res.json());

/**
 * Determines the gradient color URL based on the typology name.
 * Used for dynamic coloring in charts.
 * 
 * @param name - The typology name (e.g., 'Réclamation', 'Information').
 * @returns A string representing the SVG gradient URL (e.g., 'url(#gradComplaint)').
 */
export const getTypologieColorUrl = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes('réclamation') || lower.includes('plainte') || lower.includes('erreur') || lower.includes('refus') || lower.includes('injoignable') || lower.includes('retard') || lower.includes('problème')) return 'url(#gradComplaint)';
  if (lower.includes('information') || lower.includes('demande') || lower.includes('question') || lower.includes('suivi')) return 'url(#gradNeutral)';
  if (lower.includes('commande') || lower.includes('prix') || lower.includes('produit') || lower.includes('livraison') || lower.includes('stock')) return 'url(#gradCommercial)';
  return 'url(#gradTeal)';
};

/**
 * Returns an appropriate icon component based on the typology name.
 * Used in the Reclamations list for visual cues.
 * 
 * @param name - The typology name.
 * @returns A React component (Lucide icon) with specific styling.
 */
export const getTypologieIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes('prix') || lower.includes('produit')) return <Tag className="w-5 h-5 mr-2 text-blue-500" />;
  if (lower.includes('injoignable') || lower.includes('appel')) return <PhoneOff className="w-5 h-5 mr-2 text-red-500" />;
  return <AlertCircle className="w-5 h-5 mr-2 text-slate-400" />;
};
