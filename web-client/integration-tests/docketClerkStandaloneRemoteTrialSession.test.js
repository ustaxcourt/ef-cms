import {
  COUNTRY_TYPES,
  PARTY_TYPES,
} from '../../shared/src/business/entities/EntityConstants';
import { docketClerkCreatesAStandaloneRemoteTrialSession } from './journey/docketClerkCreatesAStandaloneRemoteTrialSession';
import { docketClerkManuallyAddsCaseToTrialSessionWithoutNote } from './journey/docketClerkManuallyAddsCaseToTrialSessionWithoutNote';
import { docketClerkViewsOpenStandaloneRemoteTrialSession } from './journey/docketClerkViewsOpenStandaloneRemoteTrialSession';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import { loginAs, setupTest, uploadPetition } from './helpers';

const cerebralTest = setupTest();

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

  describe('Create a case and adds it to standalone remote trial session', () => {
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

    docketClerkManuallyAddsCaseToTrialSessionWithoutNote(cerebralTest);
  });

  describe('Remove cases from standalone remote trial session', () => {});

  describe('Close the trial session', () => {
    //Update trial start date to before today
    // should be able to close the session
  });
});
