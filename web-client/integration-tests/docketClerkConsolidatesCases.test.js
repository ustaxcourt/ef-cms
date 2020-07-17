import { loginAs, setupTest, uploadPetition } from './helpers';
// docketclerk
import { docketClerkConsolidatesCases } from './journey/docketClerkConsolidatesCases';
import { docketClerkOpensCaseConsolidateModal } from './journey/docketClerkOpensCaseConsolidateModal';
import { docketClerkSearchesForCaseToConsolidateWith } from './journey/docketClerkSearchesForCaseToConsolidateWith';
import { docketClerkUnconsolidatesCase } from './journey/docketClerkUnconsolidatesCase';
import { docketClerkUpdatesCaseStatusToReadyForTrial } from './journey/docketClerkUpdatesCaseStatusToReadyForTrial';
// petitioner
import { petitionerVerifiesConsolidatedCases } from './journey/petitionerVerifiesConsolidatedCases';
import { petitionerVerifiesUnconsolidatedCases } from './journey/petitionerVerifiesUnconsolidatedCases';
import { petitionerViewsDashboard } from './journey/petitionerViewsDashboard';

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

  loginAs(test, 'petitioner@example.com');

  it('login as a petitioner and create the lead case', async () => {
    const caseDetail = await uploadPetition(test, overrides);
    expect(caseDetail.docketNumber).toBeDefined();
    test.caseId = test.leadCaseId = caseDetail.caseId;
    test.docketNumber = test.leadDocketNumber = caseDetail.docketNumber;
  });

  loginAs(test, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusToReadyForTrial(test);

  loginAs(test, 'petitioner@example.com');

  it('login as a petitioner and create the case to consolidate with', async () => {
    const caseDetail = await uploadPetition(test, overrides);
    expect(caseDetail.docketNumber).toBeDefined();
    test.caseId = caseDetail.caseId;
    test.docketNumber = caseDetail.docketNumber;
  });

  loginAs(test, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusToReadyForTrial(test);
  docketClerkOpensCaseConsolidateModal(test);
  docketClerkSearchesForCaseToConsolidateWith(test);
  docketClerkConsolidatesCases(test);

  loginAs(test, 'petitioner@example.com');
  petitionerViewsDashboard(test);
  petitionerVerifiesConsolidatedCases(test);

  loginAs(test, 'docketclerk@example.com');
  docketClerkUnconsolidatesCase(test);

  loginAs(test, 'petitioner@example.com');
  petitionerViewsDashboard(test);
  petitionerVerifiesUnconsolidatedCases(test);
});
