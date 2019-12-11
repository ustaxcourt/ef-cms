import { loginAs, setupTest, uploadPetition } from './helpers';
import docketClerkConsolidatesCases from './journey/docketClerkConsolidatesCases';
import docketClerkCreatesATrialSession from './journey/docketClerkCreatesATrialSession';
import docketClerkLogIn from './journey/docketClerkLogIn';
import docketClerkOpensCaseConsolidateModal from './journey/docketClerkOpensCaseConsolidateModal';
import docketClerkSearchesForCaseToConsolidateWith from './journey/docketClerkSearchesForCaseToConsolidateWith';
import docketClerkSetsCalendarForTrialSession from './journey/docketClerkSetsCalendarForTrialSession';
import docketClerkSignsOut from './journey/docketClerkSignsOut';
import docketClerkUpdatesCaseStatusFromCalendaredToSubmitted from './journey/docketClerkUpdatesCaseStatusFromCalendaredToSubmitted';
import docketClerkUpdatesCaseStatusToReadyForTrial from './journey/docketClerkUpdatesCaseStatusToReadyForTrial';
import docketClerkViewsEligibleCasesForTrialSession from './journey/docketClerkViewsEligibleCasesForTrialSession';
import docketClerkViewsInactiveCasesForTrialSession from './journey/docketClerkViewsInactiveCasesForTrialSession';
import docketClerkViewsTrialSessionList from './journey/docketClerkViewsTrialSessionList';

const test = setupTest();
const trialLocation = `Boise, Idaho, ${Date.now()}`;

const overrides = {
  preferredTrialCity: trialLocation,
  trialLocation,
};

describe('Case Consolidation Journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  it('login as a petitioner and create the lead case', async () => {
    await loginAs(test, 'petitioner');
    const caseDetail = await uploadPetition(test, overrides);
    test.caseId = test.leadCaseId = caseDetail.caseId;
    test.docketNumber = test.leadDocketNumber = caseDetail.docketNumber;
  });

  docketClerkLogIn(test);
  docketClerkUpdatesCaseStatusToReadyForTrial(test);
  docketClerkSignsOut(test);

  it('login as a petitioner and create the case to consolidate with', async () => {
    await loginAs(test, 'petitioner');
    const caseDetail = await uploadPetition(test, overrides);
    test.caseId = caseDetail.caseId;
    test.docketNumber = caseDetail.docketNumber;
  });

  docketClerkLogIn(test);
  docketClerkUpdatesCaseStatusToReadyForTrial(test);
  docketClerkOpensCaseConsolidateModal(test);
  docketClerkSearchesForCaseToConsolidateWith(test);
  docketClerkConsolidatesCases(test);
  docketClerkSignsOut(test);
});
