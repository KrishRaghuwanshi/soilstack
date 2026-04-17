import { create } from 'zustand';
import type { Campaign, Submission } from '../lib/types';
import { MOCK_CAMPAIGNS, MOCK_SUBMISSIONS } from '../lib/mockData';

interface AuthorityState {
  // Authority sees ALL campaigns from all companies
  allCampaigns: Campaign[];
  // Authority sees all verified submissions (approved by company officials)
  verifiedSubmissions: Submission[];
  // Stats
  totalCampaigns: number;
  totalFarmers: number;
  totalTonnesVerified: number;

  isLoading: boolean;
  loadMockData: () => void;
}

export const useValidatorStore = create<AuthorityState>((set) => ({
  allCampaigns: [],
  verifiedSubmissions: [],
  totalCampaigns: 0,
  totalFarmers: 0,
  totalTonnesVerified: 0,
  isLoading: false,

  loadMockData: () => {
    const campaigns = MOCK_CAMPAIGNS;
    const verified = MOCK_SUBMISSIONS.filter(
      (s) => s.validator_verified === true
    );
    const totalFarmers = campaigns.reduce((sum, c) => sum + c.enrolled_farmers, 0);
    const totalTonnes = verified.reduce((sum, s) => sum + (s.estimated_tonnes || 0), 0);

    set({
      allCampaigns: campaigns,
      verifiedSubmissions: verified,
      totalCampaigns: campaigns.length,
      totalFarmers,
      totalTonnesVerified: totalTonnes,
    });
  },
}));
