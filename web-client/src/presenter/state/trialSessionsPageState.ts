import { TrialSessionInfoDTO } from '@shared/business/dto/trialSessions/TrialSessionInfoDTO';
import { TrialSessionProceedingType } from '@shared/business/entities/EntityConstants';

const filters: TrialSessionsFilters = {
  currentTab: 'calendared' as 'calendared' | 'new',
  judgeId: 'All',
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
  judgeId: string;
  proceedingType: TrialSessionProceedingType | 'All';
  sessionStatus: string;
  sessionType: string;
  trialLocation: string;
};
