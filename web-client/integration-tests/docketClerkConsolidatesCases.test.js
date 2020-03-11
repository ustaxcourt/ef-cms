import { loginAs, setupTest, uploadPetition } from './helpers';
// docketclerk
import docketClerkConsolidatesCases from './journey/docketClerkConsolidatesCases';
import docketClerkLogIn from './journey/docketClerkLogIn';
import docketClerkOpensCaseConsolidateModal from './journey/docketClerkOpensCaseConsolidateModal';
import docketClerkSearchesForCaseToConsolidateWith from './journey/docketClerkSearchesForCaseToConsolidateWith';
import docketClerkSignsOut from './journey/docketClerkSignsOut';
import docketClerkUnconsolidatesCase from './journey/docketClerkUnconsolidatesCase';
import docketClerkUpdatesCaseStatusToReadyForTrial from './journey/docketClerkUpdatesCaseStatusToReadyForTrial';
// petitioner
import petitionerLogin from './journey/petitionerLogIn';
import petitionerSignsOut from './journey/petitionerSignsOut';
import petitionerVerifiesConsolidatedCases from './journey/petitionerVerifiesConsolidatedCases';
import petitionerVerifiesUnconsolidatedCases from './journey/petitionerVerifiesUnconsolidatedCases';
import petitionerViewsDashboard from './journey/petitionerViewsDashboard';

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

  loginAs(test, 'petitioner');

  it('login as a petitioner and create the lead case', async () => {
    const caseDetail = await uploadPetition(test, overrides);
    test.caseId = test.leadCaseId = caseDetail.caseId;
    test.docketNumber = test.leadDocketNumber = caseDetail.docketNumber;
  });

  docketClerkLogIn(test);
  docketClerkUpdatesCaseStatusToReadyForTrial(test);
  docketClerkSignsOut(test);

  loginAs(test, 'petitioner');

  it('login as a petitioner and create the case to consolidate with', async () => {
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

  petitionerLogin(test);
  petitionerViewsDashboard(test);
  petitionerVerifiesConsolidatedCases(test);
  petitionerSignsOut(test);

  docketClerkLogIn(test);
  docketClerkUnconsolidatesCase(test);
  docketClerkSignsOut(test);

  petitionerLogin(test);
  petitionerViewsDashboard(test);
  petitionerVerifiesUnconsolidatedCases(test);
  petitionerSignsOut(test);
});
