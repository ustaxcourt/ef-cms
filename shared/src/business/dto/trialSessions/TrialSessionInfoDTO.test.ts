import { TrialSessionInfoDTO } from '@shared/business/dto/trialSessions/TrialSessionInfoDTO';
import {
  SESSION_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
  TRIAL_SESSION_SCOPE_TYPES,
} from '@shared/business/entities/EntityConstants';
import { MOCK_TRIAL_REMOTE } from '@shared/test/mockTrial';

describe('TrialSessionInfoDTO', () => {
  it('should return only DTO information from a RawTrialSession', () => {
    const DTO_RESULTS = new TrialSessionInfoDTO({
      ...MOCK_TRIAL_REMOTE,
      estimatedEndDate: 'TEST_estimatedEndDate',
      isCalendared: true,
      judge: { name: 'TEST_JUDGEE_NAME', userId: 'TEST_JUDGE_USER_ID' },
      proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
      sessionType: SESSION_TYPES.small,
      startDate: 'TEST_startDate',
      startTime: 'TEST_startTime',
      term: 'TEST_term',
      termYear: 'TEST_termYear',
      trialLocation: 'TEST_trialLocation',
      trialSessionId: 'TEST_trialSessionId',
      noticeIssuedDate: 'TEST_noticeIssuedDate',
      sessionScope: TRIAL_SESSION_SCOPE_TYPES.locationBased,
      sessionStatus: 'TEST_sessionStatus',
      swingSession: true,
      dismissedAlertForNOTT: true,
    });

    expect(DTO_RESULTS).toEqual({
      estimatedEndDate: 'TEST_estimatedEndDate',
      isCalendared: true,
      judge: { name: 'TEST_JUDGEE_NAME', userId: 'TEST_JUDGE_USER_ID' },
      proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
      sessionType: SESSION_TYPES.small,
      startDate: 'TEST_startDate',
      startTime: 'TEST_startTime',
      term: 'TEST_term',
      termYear: 'TEST_termYear',
      trialLocation: 'TEST_trialLocation',
      trialSessionId: 'TEST_trialSessionId',
      noticeIssuedDate: 'TEST_noticeIssuedDate',
      sessionScope: TRIAL_SESSION_SCOPE_TYPES.locationBased,
      sessionStatus: 'TEST_sessionStatus',
      swingSession: true,
      dismissedAlertForNOTT: true,
    });
  });
});
