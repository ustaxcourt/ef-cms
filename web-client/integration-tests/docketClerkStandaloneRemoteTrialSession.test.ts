import {
  COUNTRY_TYPES,
  PARTY_TYPES,
} from '../../shared/src/business/entities/EntityConstants';
import { MOCK_TRIAL_STANDALONE_REMOTE } from '../../shared/src/test/mockTrial';
import { docketClerkClosesStandaloneRemoteTrialSession } from './journey/docketClerkClosesStandaloneRemoteTrialSession';
import { docketClerkManuallyAddsCaseToTrialSessionWithoutNote } from './journey/docketClerkManuallyAddsCaseToTrialSessionWithoutNote';
import { docketClerkRemovesCaseFromTrial } from './journey/docketClerkRemovesCaseFromTrial';
import { docketClerkVerifiesSessionIsNotClosed } from './journey/docketClerkVerifiesSessionIsNotClosed';
import { docketClerkViewsStandaloneRemoteTrialSession } from './journey/docketClerkViewsStandaloneRemoteTrialSession';
import {
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
} from './helpers';
import axios from 'axios';

describe('Docket clerk standalone remote trial session journey', () => {
  const cerebralTest = setupTest();

  const axiosInstance = axios.create({
    headers: {
      Authorization:
        // mocked admissions clerk user
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWlzc2lvbnNjbGVya0BleGFtcGxlLmNvbSIsIm5hbWUiOiJUZXN0IEFkbWlzc2lvbnMgQ2xlcmsiLCJyb2xlIjoiYWRtaXNzaW9uc2NsZXJrIiwic2VjdGlvbiI6ImFkbWlzc2lvbnMiLCJjdXN0b206dXNlcklkIjoiOWQ3ZDYzYjctZDdhNS00OTA1LWJhODktZWY3MWJmMzAwNTdmIiwiY3VzdG9tOnJvbGUiOiJhZG1pc3Npb25zY2xlcmsiLCJzdWIiOiI5ZDdkNjNiNy1kN2E1LTQ5MDUtYmE4OS1lZjcxYmYzMDA1N2YiLCJpYXQiOjE2MDk0NDU1MjZ9.0SHlDNenfsLo4GJ6aC6Utwxh6ec0NCYDG0fLhcqhYAs',
      'Content-Type': 'application/json',
    },
    timeout: 2000,
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  it('Create a standalone remote trial session with Small session type', async () => {
    await axiosInstance.post(
      'http://localhost:4000/trial-sessions',
      MOCK_TRIAL_STANDALONE_REMOTE,
    );

    cerebralTest.lastCreatedTrialSessionId =
      MOCK_TRIAL_STANDALONE_REMOTE.trialSessionId;

    await refreshElasticsearchIndex();
  });

  docketClerkViewsStandaloneRemoteTrialSession(cerebralTest);

  loginAs(cerebralTest, 'petitioner@example.com');
  it('login as a petitioner and create a case', async () => {
    const caseDetail = await uploadPetition(cerebralTest, {
      contactSecondary: {
        address1: '734 Cowley Parkway',
        city: 'Somewhere',
        countryType: COUNTRY_TYPES.DOMESTIC,
        name: 'NOTAREALNAMEFORTESTING',
        phone: '+1 (884) 358-9729',
        postalCode: '77546',
        state: 'CT',
      },
      partyType: PARTY_TYPES.petitionerSpouse,
    });
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkManuallyAddsCaseToTrialSessionWithoutNote(cerebralTest);

  docketClerkRemovesCaseFromTrial(cerebralTest);
  docketClerkVerifiesSessionIsNotClosed(cerebralTest);

  describe('Close the trial session', () => {
    docketClerkClosesStandaloneRemoteTrialSession(cerebralTest);
    docketClerkViewsStandaloneRemoteTrialSession(cerebralTest, 'Closed');
  });
});
