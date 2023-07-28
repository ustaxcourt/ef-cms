import { SESSION_TYPES } from '../../shared/src/business/entities/EntityConstants';
import { createConsolidatedGroup } from './journey/consolidation/createConsolidatedGroup';
import { docketClerkAddsCaseToHearing } from './journey/docketClerkAddsCaseToHearing';
import { docketClerkAddsTrackedDocketEntry } from './journey/docketClerkAddsTrackedDocketEntry';
import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkRemovesCaseFromHearing } from './journey/docketClerkRemovesCaseFromHearing';
import { docketClerkSealsCase } from './journey/docketClerkSealsCase';
import { docketClerkUnsealsCase } from './journey/docketClerkUnsealsCase';
import { docketClerkVerifiesConsolidatedCases } from './journey/docketClerkVerifiesConsolidatedCases';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import { fakeFile, loginAs, setupTest } from './helpers';
import { manuallyAddCaseToTrial } from './utils/manuallyAddCaseToTrial';
import { petitionsClerkBlocksCase } from './journey/petitionsClerkBlocksCase';
import { petitionsClerkPrioritizesCase } from './journey/petitionsClerkPrioritizesCase';
import { petitionsClerkUnblocksCase } from './journey/petitionsClerkUnblocksCase';
import { petitionsClerkUnprioritizesCase } from './journey/petitionsClerkUnprioritizesCase';
import { removePendingItemFromCase } from './journey/removePendingItemFromCase';
import { updateACaseCaption } from './journey/updateACaseCaption';

describe('Docket Clerk verifies Consolidated Cases', () => {
  const cerebralTest = setupTest();

  cerebralTest.createdTrialSessions = [];

  const trialLocation = `Boise, Idaho, ${Date.now()}`;
  const caseOverrides = {
    caseCaption: 'Mona Schultz, Petitioner',
    docketNumberSuffix: 'L',
    preferredTrialCity: trialLocation,
    trialLocation,
  };

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  describe('Create a consolidated group', () => {
    createConsolidatedGroup(cerebralTest, caseOverrides);
  });

  describe('Verify consolidated group functionality', () => {
    docketClerkSealsCase(cerebralTest);
    docketClerkVerifiesConsolidatedCases(cerebralTest);

    docketClerkUnsealsCase(cerebralTest);
    docketClerkVerifiesConsolidatedCases(cerebralTest);

    docketClerkCreatesATrialSession(cerebralTest, {
      sessionType: SESSION_TYPES.motionHearing,
      trialLocation,
    });
    docketClerkViewsTrialSessionList(cerebralTest);
    docketClerkAddsCaseToHearing(cerebralTest, 'Low blast radius', 0);
    docketClerkVerifiesConsolidatedCases(cerebralTest);

    docketClerkRemovesCaseFromHearing(cerebralTest);
    docketClerkVerifiesConsolidatedCases(cerebralTest);

    manuallyAddCaseToTrial(cerebralTest);
    docketClerkVerifiesConsolidatedCases(cerebralTest);

    loginAs(cerebralTest, 'petitionsclerk@example.com');
    petitionsClerkPrioritizesCase(cerebralTest);

    loginAs(cerebralTest, 'docketclerk@example.com');
    docketClerkVerifiesConsolidatedCases(cerebralTest);

    loginAs(cerebralTest, 'petitionsclerk@example.com');
    petitionsClerkUnprioritizesCase(cerebralTest);

    loginAs(cerebralTest, 'docketclerk@example.com');
    docketClerkVerifiesConsolidatedCases(cerebralTest);

    loginAs(cerebralTest, 'petitionsclerk@example.com');
    petitionsClerkBlocksCase(cerebralTest, trialLocation, caseOverrides);

    loginAs(cerebralTest, 'docketclerk@example.com');
    docketClerkVerifiesConsolidatedCases(cerebralTest);

    loginAs(cerebralTest, 'petitionsclerk@example.com');
    petitionsClerkUnblocksCase(cerebralTest, trialLocation);

    loginAs(cerebralTest, 'docketclerk@example.com');
    docketClerkVerifiesConsolidatedCases(cerebralTest);

    const updatedCaseCaption = 'I am the new case caption!';
    updateACaseCaption(cerebralTest, updatedCaseCaption);
    it('docketClerk updates Case Caption', () => {
      const caseDetail = cerebralTest.getState('caseDetail');
      expect(caseDetail.caseCaption).toBeDefined();
      expect(caseDetail.caseCaption).toEqual(updatedCaseCaption);
    });
    docketClerkVerifiesConsolidatedCases(cerebralTest);

    docketClerkAddsTrackedDocketEntry(cerebralTest, fakeFile, false);
    removePendingItemFromCase(cerebralTest, 'Docket Clerk');
    docketClerkVerifiesConsolidatedCases(cerebralTest);
  });
});
