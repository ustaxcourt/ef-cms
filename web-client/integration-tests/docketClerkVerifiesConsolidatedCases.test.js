import { docketClerkConsolidatesCases } from './journey/docketClerkConsolidatesCases';
import { docketClerkOpensCaseConsolidateModal } from './journey/docketClerkOpensCaseConsolidateModal';
import { docketClerkSealsCase } from './journey/docketClerkSealsCase';
import { docketClerkSearchesForCaseToConsolidateWith } from './journey/docketClerkSearchesForCaseToConsolidateWith';
import { docketClerkUnsealsCase } from './journey/docketClerkUnsealsCase';
import { docketClerkUpdatesCaseStatusToReadyForTrial } from './journey/docketClerkUpdatesCaseStatusToReadyForTrial';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerkBlocksCase } from './journey/petitionsClerkBlocksCase';
import { petitionsClerkPrioritizesCase } from './journey/petitionsClerkPrioritizesCase';
import { petitionsClerkUnprioritizesCase } from './journey/petitionsClerkUnprioritizesCase';

const cerebralTest = setupTest();
const trialLocation = `Boise, Idaho, ${Date.now()}`;

let overrides = {
  preferredTrialCity: trialLocation,
  trialLocation,
};

let caseDetail;

describe('Case Consolidation Journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');

  it('login as a petitioner and create the lead case', async () => {
    caseDetail = await uploadPetition(cerebralTest, overrides);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = cerebralTest.leadDocketNumber =
      caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusToReadyForTrial(cerebralTest);
  docketClerkOpensCaseConsolidateModal(cerebralTest);
  docketClerkSearchesForCaseToConsolidateWith(cerebralTest);

  it('login as a petitioner and create the case to consolidate with', async () => {
    cerebralTest.docketNumberDifferentPlaceOfTrial = null;
    caseDetail = await uploadPetition(cerebralTest, overrides);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusToReadyForTrial(cerebralTest);
  docketClerkOpensCaseConsolidateModal(cerebralTest);
  docketClerkSearchesForCaseToConsolidateWith(cerebralTest);
  docketClerkConsolidatesCases(cerebralTest);

  // seal case with a case that's consolidated
  // test that consolidatedCases are STILL set on caseDetail
  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkSealsCase(cerebralTest);

  it('Docket clerk verifies consolidates cases remain in state after sealing case', () => {
    expect(cerebralTest.getState('caseDetail')).toHaveProperty(
      'consolidatedCases',
    );
    expect(
      cerebralTest.getState('caseDetail.consolidatedCases').length,
    ).toEqual(2);
  });

  // Unseal case with a case that's consolidated
  // test that consolidatedCases are STILL set on caseDetail
  docketClerkUnsealsCase(cerebralTest);
  it('Docket clerk verifies consolidates cases remain in state after unsealing case', () => {
    expect(cerebralTest.getState('caseDetail')).toHaveProperty(
      'consolidatedCases',
    );
    expect(
      cerebralTest.getState('caseDetail.consolidatedCases').length,
    ).toEqual(2);
  });

  // Mark a case as 'high priority' with a case that's consolidated
  // test that consolidatedCases are STILL set on caseDetail
  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkPrioritizesCase(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');

  it('Docket clerk verifies consolidates cases remain in state after marking a case as high priority', () => {
    expect(cerebralTest.getState('caseDetail')).toHaveProperty(
      'consolidatedCases',
    );
    expect(
      cerebralTest.getState('caseDetail.consolidatedCases').length,
    ).toEqual(2);
  });

  // Unmark a case as 'high priority' case with a case that's consolidated
  // test that consolidatedCases are STILL set on caseDetail
  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkUnprioritizesCase(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');

  it('Docket clerk verifies consolidates cases remain in state after unmarking a case as high priority', () => {
    expect(cerebralTest.getState('caseDetail')).toHaveProperty(
      'consolidatedCases',
    );
    expect(
      cerebralTest.getState('caseDetail.consolidatedCases').length,
    ).toEqual(2);
  });

  // Block a case that's consolidated
  // test that consolidatedCases are STILL set on caseDetail
  overrides = {
    ...overrides,
    caseCaption: 'Mona Schultz, Petitioner',
    docketNumberSuffix: 'L',
  };

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkBlocksCase(cerebralTest, trialLocation, overrides);

  loginAs(cerebralTest, 'docketclerk@example.com');
  it('Docket clerk verifies consolidates cases remain in state after blocking a case', () => {
    expect(cerebralTest.getState('caseDetail')).toHaveProperty(
      'consolidatedCases',
    );
    expect(
      cerebralTest.getState('caseDetail.consolidatedCases').length,
    ).toEqual(2);
  });

  // Unblock a case that's consolidated
  // test that consolidatedCases are STILL set on caseDetail

  // Add a case to trial that's consolidated
  // test that consolidatedCases are STILL set on caseDetail

  // Remove a case from trial that's consolidated
  // test that consolidatedCases are STILL set on caseDetail

  // TODO: Check for other functions that need to be tested.
});
