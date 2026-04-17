import { create } from 'zustand';
import type { Farmer, Submission, Campaign, PyrolysisProvider } from '../lib/types';
import { MOCK_FARMER, MOCK_SUBMISSIONS, MOCK_CAMPAIGNS, MOCK_PYROLYSIS_PROVIDERS } from '../lib/mockData';

interface FarmerState {
  farmer: Farmer | null;
  submissions: Submission[];
  availableCampaigns: Campaign[];
  enrolledCampaign: Campaign | null;
  earnings: {
    total_inr: number;
    pending_inr: number;
    this_season_inr: number;
  };
  pyrolysisProviders: PyrolysisProvider[];
  isLoading: boolean;

  loadMockData: () => void;
  addSubmission: (sub: Submission) => void;
  enrollInCampaign: (campaignId: string) => void;
}

export const useFarmerStore = create<FarmerState>((set, get) => ({
  farmer: null,
  submissions: [],
  availableCampaigns: [],
  enrolledCampaign: null,
  earnings: {
    total_inr: 0,
    pending_inr: 0,
    this_season_inr: 0,
  },
  pyrolysisProviders: [],
  isLoading: false,

  loadMockData: () =>
    set({
      farmer: MOCK_FARMER,
      submissions: MOCK_SUBMISSIONS,
      availableCampaigns: MOCK_CAMPAIGNS.filter((c) => c.id !== 'campaign-1'),
      enrolledCampaign: MOCK_CAMPAIGNS[0], // Enrolled in Nestlé campaign
      earnings: {
        total_inr: MOCK_FARMER.total_payment_inr,
        pending_inr: 27236,
        this_season_inr: 49706,
      },
      pyrolysisProviders: MOCK_PYROLYSIS_PROVIDERS,
    }),

  addSubmission: (sub) =>
    set((state) => ({
      submissions: [sub, ...state.submissions],
    })),

  enrollInCampaign: (campaignId) => {
    const campaign = get().availableCampaigns.find((c) => c.id === campaignId);
    if (!campaign) return;
    set({
      enrolledCampaign: campaign,
      availableCampaigns: get().availableCampaigns.filter((c) => c.id !== campaignId),
    });
  },
}));
