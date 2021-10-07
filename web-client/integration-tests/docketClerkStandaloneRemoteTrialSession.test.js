import {
  COUNTRY_TYPES,
  PARTY_TYPES,
} from '../../shared/src/business/entities/EntityConstants';
import { docketClerkCreatesAStandaloneRemoteTrialSession } from './journey/docketClerkCreatesAStandaloneRemoteTrialSession';
import { docketClerkManuallyAddsCaseToTrialSessionWithoutNote } from './journey/docketClerkManuallyAddsCaseToTrialSessionWithoutNote';
import { docketClerkRemovesCaseFromTrial } from './journey/docketClerkRemovesCaseFromTrial';
import { docketClerkVerifiesSessionIsNotClosed } from './journey/docketClerkVerifiesSessionIsNotClosed';
import { docketClerkViewsOpenStandaloneRemoteTrialSession } from './journey/docketClerkViewsOpenStandaloneRemoteTrialSession';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import { docketClerkViewsTrialSessionsTab } from './journey/docketClerkViewsTrialSessionsTab';
import { loginAs, setupTest, uploadPetition } from './helpers';

const cerebralTest = setupTest();

//todo : try osting a trial session whose date is in rthe past, otherwise cannot close
describe('Docket clerk standalone remote trial session journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  describe('Create a standalone remote trial session with Small session type', () => {
    loginAs(cerebralTest, 'docketclerk@example.com');
    docketClerkCreatesAStandaloneRemoteTrialSession(cerebralTest);
    docketClerkViewsTrialSessionList(cerebralTest);
    docketClerkViewsOpenStandaloneRemoteTrialSession(cerebralTest);
  });

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
    console.log('new case docket#', caseDetail.docketNumber);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkManuallyAddsCaseToTrialSessionWithoutNote(cerebralTest);

  docketClerkRemovesCaseFromTrial(cerebralTest);
  docketClerkVerifiesSessionIsNotClosed(cerebralTest);

  describe('Close the trial session', () => {
    // should be able to close the session
    // docket clerk views the trial session
  });
});
