import {
  COUNTRY_TYPES,
  PARTY_TYPES,
} from '../../shared/src/business/entities/EntityConstants';
import { docketClerkCreatesAnIncompleteTrialSessionBeforeCalendaring } from './journey/docketClerkCreatesAnIncompleteTrialSessionBeforeCalendaring';
import { docketClerkSetsCaseReadyForTrial } from './journey/docketClerkSetsCaseReadyForTrial';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { markAllCasesAsQCed } from './journey/markAllCasesAsQCed';
import { petitionsClerkCompletesAndSetsTrialSession } from './journey/petitionsClerkCompletesAndSetsTrialSession';
import { petitionsClerkSubmitsCaseToIrs } from './journey/petitionsClerkSubmitsCaseToIrs';
import { petitionsClerkViewsDocketRecordAfterSettingTrial } from './journey/petitionsClerkViewsDocketRecordAfterSettingTrial';

const test = setupTest();

describe('Generate Notices of Trial Session with Paper Service', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    test.closeSocket();
  });

  const caseCount = 2;
  const trialLocation = `Albuquerque, New Mexico, ${Date.now()}`;
  const overrides = {
    contactSecondary: {
      address1: '123 Paper St.',
      city: 'Paper City',
      countryType: COUNTRY_TYPES.DOMESTIC,
      name: 'Richard Papers',
      phone: '1231231234',
      postalCode: '12345',
      state: 'IA',
    },
    hasPaper: true,
    partyType: PARTY_TYPES.petitionerSpouse,
    preferredTrialCity: trialLocation,
    procedureType: 'Small', // should generate a Standing Pretrial Notice
    trialLocation,
  };

  test.casesReadyForTrial = [];

  const createdCaseIds = [];
  const createdDocketNumbers = [];

  const makeCaseReadyForTrial = (test, id, caseOverrides) => {
    loginAs(test, 'petitioner@example.com');
    it(`Create case ${id}`, async () => {
      const caseDetail = await uploadPetition(test, caseOverrides);
      expect(caseDetail.docketNumber).toBeDefined();
      createdCaseIds.push(caseDetail.caseId);
      createdDocketNumbers.push(caseDetail.docketNumber);
      test.docketNumber = caseDetail.docketNumber;
    });

    loginAs(test, 'petitionsclerk@example.com');
    petitionsClerkSubmitsCaseToIrs(test);

    loginAs(test, 'docketclerk@example.com');
    docketClerkSetsCaseReadyForTrial(test);
  };

  loginAs(test, 'docketclerk@example.com');
  docketClerkCreatesAnIncompleteTrialSessionBeforeCalendaring(test, overrides);
  docketClerkViewsTrialSessionList(test, overrides);

  for (let i = 0; i < caseCount; i++) {
    const id = i + 1;
    makeCaseReadyForTrial(test, id, overrides);
  }

  loginAs(test, 'petitionsclerk@example.com');
  markAllCasesAsQCed(test, () => {
    return [createdCaseIds[0], createdCaseIds[1]];
  });
  petitionsClerkCompletesAndSetsTrialSession(test, overrides);
  petitionsClerkViewsDocketRecordAfterSettingTrial(test, {
    documentTitle: 'Standing Pretrial Notice',
  });
});
