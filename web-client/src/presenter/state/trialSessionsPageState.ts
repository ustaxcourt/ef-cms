import { TrialSessionInfoDTO } from '@shared/business/dto/trialSessions/TrialSessionInfoDTO';
import { TrialSessionProceedingType } from '@shared/business/entities/EntityConstants';

const filters: TrialSessionsFilters = {
  currentTab: 'calendared' as 'calendared' | 'new',
  judges: {},
  proceedingType: 'All' as TrialSessionProceedingType,
  sessionStatus: 'Open',
  sessionType: 'All',
  trialLocations: {},
};

export const initialTrialSessionPageState = {
  filters,
  trialSessions: [] as TrialSessionInfoDTO[],
};

export type TrialSessionsFilters = {
  currentTab: 'calendared' | 'new';
  judges: Record<string, { name: string; userId: string }>;
  proceedingType: TrialSessionProceedingType | 'All';
  sessionStatus: string;
  sessionType: string;
  trialLocations: Record<string, string>;
};
