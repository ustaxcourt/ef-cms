import { TrialSessionInfoDTO } from '@shared/business/dto/trialSessions/TrialSessionInfoDTO';
import { TrialSessionProceedingType } from '@shared/business/entities/EntityConstants';

const filters: TrialSessionsFilters = {
  currentTab: 'calendared' as 'calendared' | 'new',
  judgeIds: [],
  proceedingType: 'All' as TrialSessionProceedingType,
  sessionStatus: 'Open',
  sessionType: 'All',
  trialLocation: 'All',
};

export const initialTrialSessionPageState = {
  filters,
  trialSessions: [] as TrialSessionInfoDTO[],
};

export type TrialSessionsFilters = {
  currentTab: 'calendared' | 'new';
  judgeIds: string[];
  proceedingType: TrialSessionProceedingType | 'All';
  sessionStatus: string;
  sessionType: string;
  trialLocation: string;
};
