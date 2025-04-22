import {
  SESSION_STATUS_TYPES,
  SESSION_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} from '@shared/business/entities/EntityConstants';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { getPublicTrialSessionsInteractor } from '@web-api/business/useCases/trialSessions/getPublicTrialSessionsInteractor';

describe('getPublicTrialSessionsInteractor', () => {
  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getTrialSessions.mockReturnValue(MOCK_TRIAL_SESSIONS);
  });

  it('should return open trial sessions', async () => {
    const result = await getPublicTrialSessionsInteractor(applicationContext);
    expect(result.every(session => session.sessionStatus === 'Open')).toBe(
      true,
    );
  });
});

const MOCK_TRIAL_SESSIONS = [
  {
    caseOrder: [],
    createdAt: '2019-11-02T05:00:00.000Z',
    gsi1pk: 'trial-session-catalog',
    isCalendared: true,
    judge: { name: 'Cohen', userId: 'dabbad04-18d0-43ec-bafb-654e83405416' },
    maxCases: 30,
    pk: 'trial-session|0d943468-bc2e-4631-84e3-b084cf5b1fbb',
    proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
    sessionStatus: SESSION_STATUS_TYPES.open,
    sessionType: SESSION_TYPES.special,
    sk: 'trial-session|0d943468-bc2e-4631-84e3-b084cf5b1fbb',
    startDate: '2019-12-02T05:00:00.000Z',
    startTime: '21:00',
    status: 'Closed',
    term: 'Fall',
    termYear: '2019',
    trialLocation: 'Denver, Colorado',
    trialSessionId: '0d943468-bc2e-4631-84e3-b084cf5b1fbb',
  },
  {
    caseOrder: [],
    createdAt: '2020-10-25T05:00:00.000Z',
    gsi1pk: 'trial-session-catalog',
    isCalendared: true,
    judge: { name: 'Colvin', userId: 'dabbad00-18d0-43ec-bafb-654e83405416' },
    maxCases: 100,
    pk: 'trial-session|111ac21b-99f9-4321-98c8-b95db00af96b',
    proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
    sessionScope: 'Standalone Remote',
    sessionStatus: SESSION_STATUS_TYPES.open,
    sessionType: SESSION_TYPES.special,
    sk: 'trial-session|111ac21b-99f9-4321-98c8-b95db00af96b',
    startDate: '2020-11-25T05:00:00.000Z',
    startTime: '13:00',
    term: 'Fall',
    termYear: '2020',
    trialLocation: 'Standalone Remote',
    trialSessionId: '111ac21b-99f9-4321-98c8-b95db00af96b',
  },
  {
    caseOrder: [],
    createdAt: '2020-10-02T05:00:00.000Z',
    gsi1pk: 'trial-session-catalog',
    isCalendared: false,
    judge: { name: 'Cohen', userId: 'dabbad04-18d0-43ec-bafb-654e83405416' },
    maxCases: 8,
    pk: 'trial-session|149159ca-f4a1-4b2b-bc24-bd1fbe6defdc',
    proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
    sessionStatus: SESSION_STATUS_TYPES.new,
    sessionType: SESSION_TYPES.regular,
    sk: 'trial-session|149159ca-f4a1-4b2b-bc24-bd1fbe6defdc',
    startDate: '2020-12-02T05:00:00.000Z',
    startTime: '09:00',
    term: 'Fall',
    termYear: '2020',
    trialLocation: 'Birmingham, Alabama',
    trialSessionId: '149159ca-f4a1-4b2b-bc24-bd1fbe6defdc',
  },
];
