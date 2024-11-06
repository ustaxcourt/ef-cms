import {
  SESSION_STATUS_TYPES,
  TrialSessionProceedingType,
  TrialSessionTypes,
} from '@shared/business/entities/EntityConstants';
import { TrialSessionInfoDTO } from '@shared/business/dto/trialSessions/TrialSessionInfoDTO';

const filters: TrialSessionsFilters = {
  currentTab: 'calendared' as 'calendared' | 'new',
  endDate: '',
  judges: {},
  pageNumber: 0,
  proceedingType: 'All' as TrialSessionProceedingType,
  sessionStatus: SESSION_STATUS_TYPES.open,
  sessionTypes: {},
  startDate: '',
  trialLocations: {},
};

export const initialTrialSessionPageState = {
  filters,
  trialSessions: [] as TrialSessionInfoDTO[],
};

export type TrialSessionsFilters = {
  currentTab: 'calendared' | 'new';
  endDate: string;
  pageNumber: number;
  judges: Record<string, { name: string; userId: string }>;
  proceedingType: TrialSessionProceedingType | 'All';
  sessionStatus: string;
  sessionTypes: Record<string, TrialSessionTypes>;
  startDate: string;
  trialLocations: Record<string, string>;
};
