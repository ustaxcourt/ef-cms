import '@web-api/persistence/postgres/trialSessions/mocks.jest';
import {
  SESSION_STATUS_TYPES,
  SESSION_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} from '@shared/business/entities/EntityConstants';
import { getPublicTrialSessionsInteractor } from '@web-api/business/useCases/trialSessions/getPublicTrialSessionsInteractor';
import { getTrialSessions as getTrialSessionsMock } from '@web-api/persistence/postgres/trialSessions/getTrialSessions';
import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';

describe('getPublicTrialSessionsInteractor', () => {
  const getTrialSessions = jest.mocked(getTrialSessionsMock);

  beforeEach(() => {
    getTrialSessions.mockResolvedValue(MOCK_TRIAL_SESSIONS);
  });

  it('should return open trial sessions', async () => {
    const result = await getPublicTrialSessionsInteractor();
    expect(result.every(session => session.sessionStatus === 'Open')).toBe(
      true,
    );
  });
});

const MOCK_TRIAL_SESSIONS: RawTrialSession[] = [
  {
    caseOrder: [],
    createdAt: '2019-11-02T05:00:00.000Z',
    isCalendared: true,
    judge: { name: 'Cohen', userId: 'dabbad04-18d0-43ec-bafb-654e83405416' },
    maxCases: 30,
    proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
    sessionStatus: SESSION_STATUS_TYPES.open,
    sessionType: SESSION_TYPES.special,
    startDate: '2019-12-02T05:00:00.000Z',
    startTime: '21:00',
    term: 'Fall',
    termYear: '2019',
    trialLocation: 'Denver, Colorado',
    trialSessionId: '0d943468-bc2e-4631-84e3-b084cf5b1fbb',
    hasNottBeenServed: false,
    sessionScope: 'Location-based',
    paperServicePdfs: [],
  },
  {
    caseOrder: [],
    createdAt: '2020-10-25T05:00:00.000Z',
    isCalendared: true,
    judge: { name: 'Colvin', userId: 'dabbad00-18d0-43ec-bafb-654e83405416' },
    maxCases: 100,
    proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
    sessionScope: 'Standalone Remote',
    sessionStatus: SESSION_STATUS_TYPES.open,
    sessionType: SESSION_TYPES.special,
    startDate: '2020-11-25T05:00:00.000Z',
    startTime: '13:00',
    term: 'Fall',
    termYear: '2020',
    trialLocation: 'Standalone Remote',
    trialSessionId: '111ac21b-99f9-4321-98c8-b95db00af96b',
    hasNottBeenServed: false,
    paperServicePdfs: [],
  },
  {
    caseOrder: [],
    createdAt: '2020-10-02T05:00:00.000Z',
    isCalendared: false,
    judge: { name: 'Cohen', userId: 'dabbad04-18d0-43ec-bafb-654e83405416' },
    maxCases: 8,
    proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
    sessionStatus: SESSION_STATUS_TYPES.new,
    sessionType: SESSION_TYPES.regular,
    startDate: '2020-12-02T05:00:00.000Z',
    startTime: '09:00',
    term: 'Fall',
    termYear: '2020',
    trialLocation: 'Birmingham, Alabama',
    trialSessionId: '149159ca-f4a1-4b2b-bc24-bd1fbe6defdc',
    hasNottBeenServed: false,
    sessionScope: 'Location-based',
    paperServicePdfs: [],
  },
];
