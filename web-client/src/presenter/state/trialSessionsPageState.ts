import {
  SESSION_STATUS_TYPES,
  TrialSessionProceedingType,
  TrialSessionTypes,
} from '@shared/business/entities/EntityConstants';
import { TrialSessionInfoDTO } from '@shared/business/dto/trialSessions/TrialSessionInfoDTO';

const filters: TrialSessionsFilters = {
  currentTab: 'calendared' as 'calendared' | 'new',
  judges: {},
  proceedingType: 'All' as TrialSessionProceedingType,
  sessionStatus: SESSION_STATUS_TYPES.open,
  sessionTypes: {},
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
  sessionTypes: Record<string, TrialSessionTypes>;
  trialLocations: Record<string, string>;
};
