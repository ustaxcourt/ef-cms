import { setupTest } from './helpers';
import { uploadPetition } from './helpers';
import captureCreatedCase from './journey/captureCreatedCase';
import markAllCasesAsQCed from './journey/markAllCasesAsQCed';

import docketClerkCreatesAnIncompleteTrialSessionBeforeCalendaring from './journey/docketClerkCreatesAnIncompleteTrialSessionBeforeCalendaring';
import docketClerkLogIn from './journey/docketClerkLogIn';
import docketClerkSetsCaseReadyForTrial from './journey/docketClerkSetsCaseReadyForTrial';
import docketClerkViewsTrialSessionList from './journey/docketClerkViewsTrialSessionList';

import petitionerLogin from './journey/petitionerLogIn';
import petitionerViewsDashboard from './journey/petitionerViewsDashboard';

import petitionsClerkCompletesAndSetsTrialSession from './journey/petitionsClerkCompletesAndSetsTrialSession';
import petitionsClerkLogIn from './journey/petitionsClerkLogIn';
import petitionsClerkSubmitsCaseToIrs from './journey/petitionsClerkSubmitsCaseToIrs';
import petitionsClerkViewsDocketRecordAfterSettingTrial from './journey/petitionsClerkViewsDocketRecordAfterSettingTrial';

import userSignsOut from './journey/petitionerSignsOut';

const test = setupTest();

describe('Generate Notices of Trial Session with Electronically Service', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    test.closeSocket();
  });

  const caseCount = 2;
  const trialLocation = `Albuquerque, New Mexico, ${Date.now()}`;
  const overrides = {
    preferredTrialCity: trialLocation,
    procedureType: 'Regular', // should generate a Standing Pretrial Order
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
    petitionsClerkSubmitsCaseToIrs(test);
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

  petitionsClerkLogIn(test);
  markAllCasesAsQCed(test, () => {
    return [createdCases[0], createdCases[1]];
  });
  petitionsClerkCompletesAndSetsTrialSession(test);
  petitionsClerkViewsDocketRecordAfterSettingTrial(test, {
    documentTitle: 'Standing Pretrial Order', // this is the default, but setting so it's more explicit
  });
  userSignsOut(test);
});
