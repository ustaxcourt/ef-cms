import { captureCreatedCase } from './journey/captureCreatedCase';
import { loginAs, setupTest } from './helpers';
import { markAllCasesAsQCed } from './journey/markAllCasesAsQCed';
import { uploadPetition } from './helpers';

import { docketClerkCreatesAnIncompleteTrialSessionBeforeCalendaring } from './journey/docketClerkCreatesAnIncompleteTrialSessionBeforeCalendaring';
import { docketClerkSetsCaseReadyForTrial } from './journey/docketClerkSetsCaseReadyForTrial';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';

import { petitionerViewsDashboard } from './journey/petitionerViewsDashboard';

import petitionsClerkCompletesAndSetsTrialSession from './journey/petitionsClerkCompletesAndSetsTrialSession';
import petitionsClerkSubmitsCaseToIrs from './journey/petitionsClerkSubmitsCaseToIrs';
import petitionsClerkViewsDocketRecordAfterSettingTrial from './journey/petitionsClerkViewsDocketRecordAfterSettingTrial';

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
    loginAs(test, 'petitioner');
    it(`Create case ${id}`, async () => {
      await uploadPetition(test, caseOverrides);
    });
    petitionerViewsDashboard(test);
    captureCreatedCase(test, createdCases, createdDocketNumbers);

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
    return [createdCases[0], createdCases[1]];
  });
  petitionsClerkCompletesAndSetsTrialSession(test);
  petitionsClerkViewsDocketRecordAfterSettingTrial(test, {
    documentTitle: 'Standing Pretrial Order', // this is the default, but setting so it's more explicit
  });
});
