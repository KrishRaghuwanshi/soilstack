import { create } from 'zustand';
import type { Company, Campaign, CreditRegistry, ValidationJob, ValidatingAuthority, SatelliteCheck } from '../lib/types';
import { MOCK_CAMPAIGNS, MOCK_CREDITS, MOCK_VALIDATION_JOBS, MOCK_AUTHORITIES, MOCK_SATELLITE_CHECKS } from '../lib/mockData';

interface CompanyState {
  company: Company | null;
  campaigns: Campaign[];
  credits: CreditRegistry[];

  // Verification (merged from Company Official)
  pendingTasks: ValidationJob[];
  activeTask: ValidationJob | null;
  completedTasks: ValidationJob[];
  totalVerified: number;

  // New features
  authorities: ValidatingAuthority[];
  satelliteChecks: SatelliteCheck[];

  isLoading: boolean;

  loadMockData: () => void;
  acceptTask: (taskId: string) => void;
  completeTask: (taskId: string) => void;
  partnerWithAuthority: (authorityId: string) => void;
}

export const useBuyerStore = create<CompanyState>((set, get) => ({
  company: null,
  campaigns: [],
  credits: [],
  pendingTasks: [],
  activeTask: null,
  completedTasks: [],
  totalVerified: 47,
  authorities: [],
  satelliteChecks: [],
  isLoading: false,

  loadMockData: () =>
    set({
      company: {
        id: 'company-1',
        company_name: 'Nestlé India',
        country: 'IN',
        total_tonnes_purchased: 4.9,
        total_spent_usd: 316,
        active_campaigns: 1,
      },
      campaigns: [MOCK_CAMPAIGNS[0]],
      credits: MOCK_CREDITS,
      pendingTasks: MOCK_VALIDATION_JOBS,
      completedTasks: [],
      authorities: MOCK_AUTHORITIES,
      satelliteChecks: MOCK_SATELLITE_CHECKS,
    }),

  partnerWithAuthority: (authorityId) => {
    set((state) => ({
      authorities: state.authorities.map((a) =>
        a.id === authorityId ? { ...a, partnered: true } : a
      ),
    }));
  },

  acceptTask: (taskId) => {
    const task = get().pendingTasks.find((t) => t.id === taskId);
    if (!task) return;
    set({
      activeTask: { ...task, status: 'accepted', accepted_at: new Date().toISOString() },
      pendingTasks: get().pendingTasks.filter((t) => t.id !== taskId),
    });
  },

  completeTask: (taskId) => {
    const { activeTask } = get();
    if (!activeTask || activeTask.id !== taskId) return;
    const completed = { ...activeTask, status: 'completed' as const, completed_at: new Date().toISOString() };
    set({
      activeTask: null,
      completedTasks: [completed, ...get().completedTasks],
      totalVerified: get().totalVerified + 1,
    });
  },
}));
