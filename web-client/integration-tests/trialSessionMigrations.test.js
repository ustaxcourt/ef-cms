import { MOCK_CASE } from '../../shared/src/test/mockCase.js';
import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { loginAs, refreshElasticsearchIndex, setupTest } from './helpers';
import axios from 'axios';

const test = setupTest();

const axiosInstance = axios.create({
  headers: {
    Authorization:
      // mocked admin user
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluIiwibmFtZSI6IlRlc3QgQWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJ1c2VySWQiOiI4NmMzZjg3Yi0zNTBiLTQ3N2QtOTJjMy00M2JkMDk1Y2IwMDYiLCJjdXN0b206cm9sZSI6ImFkbWluIiwic3ViIjoiODZjM2Y4N2ItMzUwYi00NzdkLTkyYzMtNDNiZDA5NWNiMDA2IiwiaWF0IjoxNTgyOTIxMTI1fQ.PBmSyb6_E_53FNG0GiEpAFqTNmooSh4rI0ApUQt3UH8',
    'Content-Type': 'application/json',
  },
  timeout: 2000,
});

const { CHIEF_JUDGE, STATUS_TYPES } = applicationContext.getConstants();

const calendaredTrialSession = {
  isCalendared: true,
  maxCases: 100,
  sessionType: 'Hybrid',
  startDate: '2020-08-10',
  term: 'Summer',
  termYear: '2020',
  trialLocation: 'Memphis, Tennessee',
  trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195fb',
};

const calendaredCase = {
  ...MOCK_CASE,
  associatedJudge: CHIEF_JUDGE,
  caseCaption: 'Calendared Case w/ Trial Session',
  docketNumber: '121-21',
  preferredTrialCity: 'Memphis, Tennessee',
  status: STATUS_TYPES.calendared,
  trialLocation: 'Memphis, Tennessee',
  trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195fb',
};

describe('Trial session migration journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  beforeEach(async () => {
    await refreshElasticsearchIndex();
  });

  it('should migrate trial sessions', async () => {
    await axiosInstance.post(
      'http://localhost:4000/migrate/trial-session',
      calendaredTrialSession,
    );
  });

  it('should migrate calendared cases', async () => {
    await axiosInstance.post(
      'http://localhost:4000/migrate/case',
      calendaredCase,
    );
  });

  loginAs(test, 'docketclerk@example.com');

  it('Docketclerk views migrated, calendared case with migrated trial session', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: calendaredCase.docketNumber,
    });
    expect(test.getState('caseDetail.trialSessionId')).toEqual(
      calendaredCase.trialSessionId,
    );
    expect(test.getState('caseDetail.trialLocation')).toEqual(
      calendaredTrialSession.trialLocation,
    );
  });
});
