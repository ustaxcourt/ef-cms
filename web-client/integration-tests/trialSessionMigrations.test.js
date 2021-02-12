import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { docketClerkSetsCaseReadyForTrial } from './journey/docketClerkSetsCaseReadyForTrial';
import {
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
} from './helpers';
import { petitionsClerkManuallyAddsCaseToCalendaredTrialSession } from './journey/petitionsClerkManuallyAddsCaseToCalendaredTrialSession';
import { petitionsClerkSubmitsCaseToIrs } from './journey/petitionsClerkSubmitsCaseToIrs';
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

const { TRIAL_SESSION_PROCEEDING_TYPES } = applicationContext.getConstants();

const calendaredTrialSession = {
  address1: 'some random street',
  city: 'elm street',
  isCalendared: true,
  judge: 'Cohen',
  maxCases: 100,
  postalCode: '33333',
  proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
  sessionType: 'Hybrid',
  startDate: '2020-08-10',
  state: 'FL',
  term: 'Summer',
  termYear: '2020',
  trialLocation: 'Memphis, Tennessee',
  trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195fb',
};

let caseDetail;

describe('Trial session migration journey', () => {
  const { COUNTRY_TYPES, PARTY_TYPES } = applicationContext.getConstants();

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
    test.trialSessionId = calendaredTrialSession.trialSessionId;
  });

  it('should create a new case and calendar it', async () => {
    caseDetail = await uploadPetition(test, {
      contactSecondary: {
        address1: '734 Cowley Parkway',
        city: 'Amazing',
        countryType: COUNTRY_TYPES.DOMESTIC,
        name: 'Jimothy Schultz',
        phone: '+1 (884) 358-9729',
        postalCode: '77546',
        state: 'AZ',
      },
      partyType: PARTY_TYPES.petitionerSpouse,
      preferredTrialCity: 'Memphis, Tennessee',
    });
    expect(caseDetail.docketNumber).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
    test.createdCases = [test.docketNumber];
  });

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkSubmitsCaseToIrs(test);

  loginAs(test, 'docketclerk@example.com');
  docketClerkSetsCaseReadyForTrial(test);

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkManuallyAddsCaseToCalendaredTrialSession(test, 0);

  it('Docketclerk views migrated, calendared case with migrated trial session', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: caseDetail.docketNumber,
    });
    caseDetail = test.getState('caseDetail');
    expect(test.getState('caseDetail.trialSessionId')).toBeDefined();
    expect(test.getState('caseDetail.trialLocation')).toEqual(
      calendaredTrialSession.trialLocation,
    );
  });
});
