// ─── Database Types ──────────────────────────────────────────
// Campaign-driven architecture: Company → Campaign → Farmer → Official

export type Role = 'farmer' | 'validator' | 'buyer' | 'company';

export type SubmissionStatus =
  | 'draft'
  | 'submitted'
  | 'ai_checked'
  | 'satellite_pending'
  | 'validator_pending'
  | 'verified'
  | 'minted'
  | 'paid'
  | 'rejected';

export type CarbonTier = 'standard' | 'premium' | 'ultra';
export type AIConfidence = 'low' | 'medium' | 'high';
export type SatelliteEventType = 'burn_detected' | 'no_burn_season_clear';
export type ValidationJobStatus = 'pending' | 'assigned' | 'accepted' | 'in_progress' | 'completed' | 'failed' | 'disputed';
export type CampaignStatus = 'active' | 'paused' | 'completed';

export interface Profile {
  id: string;
  role: Role;
  phone: string | null;
  name: string | null;
  language: string;
  avatar_url: string | null;
  created_at: string;
}

export interface Farmer {
  id: string;
  field_gps: GeoPoint | null;
  field_polygon: any;
  field_size_acres: number | null;
  crop_type: string | null;
  region: string | null;
  state: string | null;
  country: string;
  cooperative_id: string | null;
  total_credits_earned: number;
  total_payment_usd: number;
  total_payment_inr: number;
  seasons_active: number;
  current_season: string | null;
  upi_id: string | null;
  mpesa_number: string | null;
}

export interface Submission {
  id: string;
  farmer_id: string;
  campaign_id: string | null;
  created_at: string;
  biochar_photo_url: string | null;
  burial_photo_url: string | null;
  burial_gps: GeoPoint | null;
  burial_depth_cm: number | null;
  estimated_weight_kg: number | null;
  quality_score: number | null;
  carbon_tier: CarbonTier | null;
  estimated_carbon_pct: number | null;
  color_assessment: string | null;
  improvement_tip: string | null;
  is_valid_biochar: boolean;
  ai_confidence: AIConfidence | null;
  credit_price_usd: number | null;
  estimated_tonnes: number | null;
  estimated_payment_inr: number | null;
  ai_verified: boolean;
  ai_verified_at: string | null;
  satellite_verified: boolean;
  satellite_verified_at: string | null;
  validator_verified: boolean;
  validator_verified_at: string | null;
  credit_hash: string | null;
  credit_minted: boolean;
  credit_minted_at: string | null;
  payment_sent: boolean;
  payment_sent_at: string | null;
  payment_amount_inr: number | null;
  payment_method: string | null;
  payment_reference: string | null;
  status: SubmissionStatus;
}

export interface SoilTimelineEntry {
  id: string;
  farmer_id: string;
  photo_url: string;
  submitted_at: string;
  season_number: number | null;
  season_label: string | null;
  darkness_score: number | null;
  organic_matter_estimate_pct: number | null;
  ai_notes: string | null;
  year_over_year_change: number | null;
}

export interface SatelliteEvent {
  id: string;
  event_gps: GeoPoint;
  detected_at: string;
  firms_frp: number | null;
  firms_confidence: string | null;
  firms_satellite: string | null;
  matched_farmer_id: string | null;
  matched_submission_id: string | null;
  event_type: SatelliteEventType;
}

export interface Validator {
  id: string;
  current_gps: GeoPoint | null;
  rating: number;
  total_jobs_completed: number;
  total_earned_usd: number;
  is_available: boolean;
  max_distance_km: number;
}

export interface ValidationJob {
  id: string;
  submission_id: string;
  farmer_id: string;
  validator_id: string | null;
  farm_gps: GeoPoint | null;
  distance_km: number | null;
  dispatched_at: string;
  accepted_at: string | null;
  arrived_at: string | null;
  completed_at: string | null;
  visit_photo_url: string | null;
  visit_gps: GeoPoint | null;
  gps_match_distance_m: number | null;
  burial_depth_confirmed_cm: number | null;
  validator_notes: string | null;
  status: ValidationJobStatus;
  payout_usd: number | null;
  farmer_rating: number | null;
  // Joined
  farmer?: Farmer & { profile?: Profile };
  submission?: Submission;
}

export interface Campaign {
  id: string;
  company_id: string;
  company_name: string;
  name: string;
  region: string | null;
  state: string | null;
  country: string | null;
  crop_type: string | null;
  price_per_tonne_usd: number;
  min_tier: CarbonTier;
  max_tonnes: number;
  collected_tonnes: number;
  enrolled_farmers: number;
  status: CampaignStatus;
  created_at: string;
  season: string | null;
}

export interface CreditRegistry {
  id: string;
  credit_hash: string;
  submission_id: string | null;
  farmer_id: string | null;
  campaign_id: string | null;
  issued_at: string;
  tonnes: number;
  quality_score: number | null;
  carbon_tier: CarbonTier | null;
  price_usd: number | null;
  buyer_id: string | null;
  is_retired: boolean;
  retired_at: string | null;
  certificate_url: string | null;
}

export interface Company {
  id: string;
  company_name: string | null;
  country: string | null;
  total_tonnes_purchased: number;
  total_spent_usd: number;
  active_campaigns: number;
}

export interface ValidatingAuthority {
  id: string;
  name: string;
  accreditation: string;
  region: string;
  specializations: string[];
  partnered: boolean;
}

export interface SatelliteCheck {
  id: string;
  farmer_id: string;
  coordinates: GeoPoint;
  date: string;
  satellite_source: string;
  result: 'burn_detected' | 'no_burn';
  confidence: 'high' | 'medium' | 'low';
  image_url: string | null;
}

export type ProviderType = 'vendor' | 'ngo' | 'self';

export interface PyrolysisProvider {
  id: string;
  name: string;
  type: ProviderType;
  description: string;
  region: string;
  cost_estimate: string;
  rating: number | null;
  contact_phone: string;
}

// ─── Utility Types ───────────────────────────────────────────

export interface GeoPoint {
  type: 'Point';
  coordinates: [number, number]; // [lng, lat]
}

export interface AIScoreResult {
  quality_score: number;
  carbon_tier: CarbonTier;
  estimated_carbon_pct: number;
  color_assessment: string;
  structure_assessment: string;
  improvement_tip: string;
  credit_price_usd: number;
  confidence: AIConfidence;
  is_valid_biochar: boolean;
}

export interface SoilAnalysisResult {
  darkness_score: number;
  estimated_organic_matter_pct: number;
  color_description: string;
  biochar_visible: boolean;
  health_assessment: string;
  recommendation: string;
}
