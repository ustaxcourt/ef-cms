import { TrialSessionInfoDTO } from '@shared/business/dto/trialSessions/TrialSessionInfoDTO';
import { TrialSessionProceedingType } from '@shared/business/entities/EntityConstants';

export const initialTrialSessionPageState = {
  filters: {
    isCalendared: true, // This filter is relly just if the user is on the "Calendared" or "New" tab
    judgeId: 'All',
    proceedingType: 'All' as TrialSessionProceedingType,
    sessionStatus: 'All',
    sessionType: 'All',
    trialLocation: 'All',
  },
  trialSessions: [] as TrialSessionInfoDTO[],
};
