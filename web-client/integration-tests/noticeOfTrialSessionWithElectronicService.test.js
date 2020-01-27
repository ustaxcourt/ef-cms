import { setupTest } from './helpers';
import { uploadPetition } from './helpers';
import captureCreatedCase from './journey/captureCreatedCase';
import markAllCasesAsQCed from './journey/markAllCasesAsQCed';

import calendarClerkCompletesAndSetsTrialSession from './journey/calendarClerkCompletesAndSetsTrialSession';
import calendarClerkLogIn from './journey/calendarClerkLogIn';
import calendarClerkViewsDocketRecordAfterSettingTrial from './journey/calendarClerkViewsDocketRecordAfterSettingTrial';

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

describe('Generate Notices of Trial Session with Electronically Service', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
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
  calendarClerkCompletesAndSetsTrialSession(test);
  calendarClerkViewsDocketRecordAfterSettingTrial(test, {
    documentTitle: 'Standing Pretrial Order', // this is the default, but setting so it's more explicit
  });
  userSignsOut(test);
});
