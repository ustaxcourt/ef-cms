import { ContactFactory } from '../../shared/src/business/entities/contacts/ContactFactory';

import { loginAs, setupTest, uploadPetition } from './helpers';
import { markAllCasesAsQCed } from './journey/markAllCasesAsQCed';

import { docketClerkCreatesAnIncompleteTrialSessionBeforeCalendaring } from './journey/docketClerkCreatesAnIncompleteTrialSessionBeforeCalendaring';
import { docketClerkSetsCaseReadyForTrial } from './journey/docketClerkSetsCaseReadyForTrial';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';

import petitionsClerkCompletesAndSetsTrialSession from './journey/petitionsClerkCompletesAndSetsTrialSession';
import petitionsClerkSubmitsCaseToIrs from './journey/petitionsClerkSubmitsCaseToIrs';
import petitionsClerkViewsDocketRecordAfterSettingTrial from './journey/petitionsClerkViewsDocketRecordAfterSettingTrial';

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
      countryType: ContactFactory.COUNTRY_TYPES.DOMESTIC,
      name: 'Richard Papers',
      phone: '1231231234',
      postalCode: '12345',
      state: 'IA',
    },
    hasPaper: true,
    partyType: ContactFactory.PARTY_TYPES.petitionerSpouse,
    preferredTrialCity: trialLocation,
    procedureType: 'Small', // should generate a Standing Pretrial Notice
    trialLocation,
  };

  test.casesReadyForTrial = [];

  const createdCaseIds = [];
  const createdDocketNumbers = [];

  const makeCaseReadyForTrial = (test, id, caseOverrides) => {
    loginAs(test, 'petitioner');
    it(`Create case ${id}`, async () => {
      const caseDetail = await uploadPetition(test, caseOverrides);
      createdCaseIds.push(caseDetail.caseId);
      createdDocketNumbers.push(caseDetail.docketNumber);
      test.docketNumber = caseDetail.docketNumber;
    });

    loginAs(test, 'petitionsclerk');
    petitionsClerkSubmitsCaseToIrs(test);

    loginAs(test, 'docketclerk');
    docketClerkSetsCaseReadyForTrial(test);
  };

  loginAs(test, 'docketclerk');
  docketClerkCreatesAnIncompleteTrialSessionBeforeCalendaring(test, overrides);
  docketClerkViewsTrialSessionList(test, overrides);

  for (let i = 0; i < caseCount; i++) {
    const id = i + 1;
    makeCaseReadyForTrial(test, id, overrides);
  }

  loginAs(test, 'petitionsclerk');
  markAllCasesAsQCed(test, () => {
    return [createdCaseIds[0], createdCaseIds[1]];
  });
  petitionsClerkCompletesAndSetsTrialSession(test, overrides);
  petitionsClerkViewsDocketRecordAfterSettingTrial(test, {
    documentTitle: 'Standing Pretrial Notice',
  });
});
