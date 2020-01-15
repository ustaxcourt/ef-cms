import { ContactFactory } from '../../shared/src/business/entities/contacts/ContactFactory';

import { setupTest } from './helpers';
import { uploadPetition } from './helpers';
import captureCreatedCase from './journey/captureCreatedCase';
import markAllCasesAsQCed from './journey/markAllCasesAsQCed';

import calendarClerkLogIn from './journey/calendarClerkLogIn';

import docketClerkCompletesAndSetsTrialSession from './journey/docketClerkCompletesAndSetsTrialSession';
import docketClerkCreatesAnIncompleteTrialSessionBeforeCalendaring from './journey/docketClerkCreatesAnIncompleteTrialSessionBeforeCalendaring';
import docketClerkLogIn from './journey/docketClerkLogIn';
import docketClerkSetsCaseReadyForTrial from './journey/docketClerkSetsCaseReadyForTrial';
import docketClerkViewsTrialSessionList from './journey/docketClerkViewsTrialSessionList';

import petitionerLogin from './journey/petitionerLogIn';
import petitionerViewsDashboard from './journey/petitionerViewsDashboard';

import petitionsClerkLogIn from './journey/petitionsClerkLogIn';
import petitionsClerkRunsBatchProcess from './journey/petitionsClerkRunsBatchProcess';
import petitionsClerkSendsCaseToIRSHoldingQueue from './journey/petitionsClerkSendsCaseToIRSHoldingQueue';

import userSignsOut from './journey/petitionerSignsOut';

const test = setupTest();

describe('Generate Notices of Trial Session with Paper Service', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
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
    trialLocation,
  };

  test.casesReadyForTrial = [];

  const createdCases = [];
  const createdDocketNumbers = [];

  const makeCaseReadyForTrial = (test, id, caseOverrides) => {
    petitionerLogin(test);
    it(`Create case ${id}`, async () => {
      await uploadPetition(test, caseOverrides);
    });
    petitionerViewsDashboard(test);
    captureCreatedCase(test, createdCases, createdDocketNumbers);
    userSignsOut(test);

    petitionsClerkLogIn(test);
    petitionsClerkSendsCaseToIRSHoldingQueue(test);
    petitionsClerkRunsBatchProcess(test);
    userSignsOut(test);

    docketClerkLogIn(test);
    docketClerkSetsCaseReadyForTrial(test);
    userSignsOut(test);
  };

  docketClerkLogIn(test);
  docketClerkCreatesAnIncompleteTrialSessionBeforeCalendaring(test, overrides);
  docketClerkViewsTrialSessionList(test, overrides);
  userSignsOut(test);

  for (let i = 0; i < caseCount; i++) {
    const id = i + 1;
    makeCaseReadyForTrial(test, id, overrides);
  }

  calendarClerkLogIn(test);
  markAllCasesAsQCed(test, () => {
    return [createdCases[0], createdCases[1]];
  });
  userSignsOut(test);

  docketClerkLogIn(test);
  docketClerkCompletesAndSetsTrialSession(test, overrides);
  userSignsOut(test);
});
