import { docketClerkAddsCaseToHearing } from './journey/docketClerkAddsCaseToHearing';
import { docketClerkConsolidatesCases } from './journey/docketClerkConsolidatesCases';
import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkOpensCaseConsolidateModal } from './journey/docketClerkOpensCaseConsolidateModal';
import { docketClerkRemovesCaseFromHearing } from './journey/docketClerkRemovesCaseFromHearing';
import { docketClerkSealsCase } from './journey/docketClerkSealsCase';
import { docketClerkSearchesForCaseToConsolidateWith } from './journey/docketClerkSearchesForCaseToConsolidateWith';
import { docketClerkUnsealsCase } from './journey/docketClerkUnsealsCase';
import { docketClerkUpdatesCaseStatusToReadyForTrial } from './journey/docketClerkUpdatesCaseStatusToReadyForTrial';
import { docketClerkVerifiesConsolidatesCases } from './journey/docketClerkVerifiesConsolidatesCases';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { manuallyAddCaseToTrial } from './utils/manuallyAddCaseToTrial';
import { petitionsClerkBlocksCase } from './journey/petitionsClerkBlocksCase';
import { petitionsClerkPrioritizesCase } from './journey/petitionsClerkPrioritizesCase';
import { petitionsClerkUnblocksCase } from './journey/petitionsClerkUnblocksCase';
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

  cerebralTest.createdTrialSessions = [];

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
    /*
  TODO:
  1. refactor caseDetail to use cerebralTest
  */

    caseDetail = await uploadPetition(cerebralTest, overrides);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusToReadyForTrial(cerebralTest);
  docketClerkOpensCaseConsolidateModal(cerebralTest);
  docketClerkSearchesForCaseToConsolidateWith(cerebralTest);
  docketClerkConsolidatesCases(cerebralTest);

  /*
  TODO:
  1. refactor caseDetail to use cerebralTest
  */

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkSealsCase(cerebralTest);
  docketClerkVerifiesConsolidatesCases(cerebralTest);

  docketClerkUnsealsCase(cerebralTest);
  docketClerkVerifiesConsolidatesCases(cerebralTest);

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkPrioritizesCase(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkVerifiesConsolidatesCases(cerebralTest);

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkUnprioritizesCase(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkVerifiesConsolidatesCases(cerebralTest);

  overrides = {
    ...overrides,
    caseCaption: 'Mona Schultz, Petitioner',
    docketNumberSuffix: 'L',
  };

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkBlocksCase(cerebralTest, trialLocation, overrides);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkVerifiesConsolidatesCases(cerebralTest);

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkUnblocksCase(cerebralTest, trialLocation);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkVerifiesConsolidatesCases(cerebralTest);

  docketClerkCreatesATrialSession(cerebralTest, {
    sessionType: 'Motion/Hearing',
    trialLocation,
  });
  docketClerkViewsTrialSessionList(cerebralTest);
  docketClerkAddsCaseToHearing(cerebralTest, 'Low blast radius', 0);
  docketClerkVerifiesConsolidatesCases(cerebralTest);

  docketClerkRemovesCaseFromHearing(cerebralTest);
  docketClerkVerifiesConsolidatesCases(cerebralTest);

  manuallyAddCaseToTrial(cerebralTest);
  docketClerkVerifiesConsolidatesCases(cerebralTest);
});
