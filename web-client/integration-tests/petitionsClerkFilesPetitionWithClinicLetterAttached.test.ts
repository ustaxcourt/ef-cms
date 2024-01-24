import { SESSION_TYPES } from '../../shared/src/business/entities/EntityConstants';
import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkSetsCaseReadyForTrial } from './journey/docketClerkSetsCaseReadyForTrial';
import { docketClerkVerifiesPetitionReceiptLength } from './journey/docketClerkVerifiesPetitionReceiptLength';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import { fakeFile, loginAs, setupTest } from './helpers';
import { markAllCasesAsQCed } from './journey/markAllCasesAsQCed';
import { petitionsClerkCreatesNewCaseFromPaper } from './journey/petitionsClerkCreatesNewCaseFromPaper';
import { petitionsClerkManuallyAddsCaseToTrial } from './journey/petitionsClerkManuallyAddsCaseToTrial';
import { petitionsClerkReviewsPaperCaseBeforeServing } from './journey/petitionsClerkReviewsPaperCaseBeforeServing';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';
import { petitionsClerkSetsATrialSessionsSchedule } from './journey/petitionsClerkSetsATrialSessionsSchedule';
import { petitionsClerkViewsNewTrialSession } from './journey/petitionsClerkViewsNewTrialSession';
import { practitionerCreatesNewCase } from './journey/practitionerCreatesNewCase';
import { userVerifiesLengthOfDocketEntry } from './journey/userVerifiesLengthOfDocketEntry';

describe('Petitions Clerk creates a paper case which should have a clinic letter appended to the receipt', () => {
  const cerebralTest = setupTest();

  const overrides = {
    maxCases: 2,
    preferredTrialCity: 'Los Angeles, California',
    sessionType: SESSION_TYPES.regular,
    trialLocation: 'Los Angeles, California',
  };

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');

  petitionsClerkCreatesNewCaseFromPaper(cerebralTest, fakeFile, {
    trialLocation: 'Los Angeles, California',
  });
  petitionsClerkReviewsPaperCaseBeforeServing(cerebralTest, {
    hasIrsNoticeFormatted: 'No',
    ordersAndNoticesInDraft: ['Order Designating Place of Trial'],
    ordersAndNoticesNeeded: ['Order for Ratification of Petition'],
    petitionPaymentStatusFormatted: 'Waived 05/05/05',
    receivedAtFormatted: '01/01/01',
    shouldShowIrsNoticeDate: false,
  });
  docketClerkVerifiesPetitionReceiptLength(cerebralTest, 1);

  // creating pro se petition with preferredTrialCity and procedureType that DOES have a corresponding clinic letter
  petitionsClerkCreatesNewCaseFromPaper(cerebralTest, fakeFile, {
    procedureType: 'Regular',
    trialLocation: 'Los Angeles, California',
  });
  petitionsClerkReviewsPaperCaseBeforeServing(cerebralTest, {
    hasIrsNoticeFormatted: 'No',
    ordersAndNoticesInDraft: ['Order Designating Place of Trial'],
    ordersAndNoticesNeeded: ['Order for Ratification of Petition'],
    petitionPaymentStatusFormatted: 'Waived 05/05/05',
    receivedAtFormatted: '01/01/01',
    shouldShowIrsNoticeDate: false,
  });
  docketClerkVerifiesPetitionReceiptLength(cerebralTest, 2);

  describe('Create and sets a trial session with Regular session type for Los Angeles, California', () => {
    loginAs(cerebralTest, 'docketclerk@example.com');
    docketClerkSetsCaseReadyForTrial(cerebralTest);
    docketClerkCreatesATrialSession(cerebralTest, overrides);
    docketClerkViewsTrialSessionList(cerebralTest);

    loginAs(cerebralTest, 'petitionsclerk@example.com');
    cerebralTest.casesReadyForTrial = [];
    petitionsClerkManuallyAddsCaseToTrial(cerebralTest);
    petitionsClerkViewsNewTrialSession(cerebralTest);
    markAllCasesAsQCed(cerebralTest, () => [cerebralTest.docketNumber]);
    petitionsClerkSetsATrialSessionsSchedule(cerebralTest);
  });

  describe('verify the docket record has the NTD with clinic letter appended (2 pages total)', () => {
    userVerifiesLengthOfDocketEntry(cerebralTest, 'NTD', 2);
  });

  loginAs(cerebralTest, 'privatePractitioner@example.com');
  // creating petition with prefferredTrialCity and procedureType that DOES have a corresponding clinic letter
  practitionerCreatesNewCase(
    cerebralTest,
    fakeFile,
    'Los Angeles, California',
    'Regular',
  );
  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(cerebralTest);

  describe('Create and sets a second trial session with Regular session type for Los Angeles, California', () => {
    loginAs(cerebralTest, 'docketclerk@example.com');
    docketClerkSetsCaseReadyForTrial(cerebralTest);
    docketClerkCreatesATrialSession(cerebralTest, overrides);
    docketClerkViewsTrialSessionList(cerebralTest);

    loginAs(cerebralTest, 'petitionsclerk@example.com');
    cerebralTest.casesReadyForTrial = [];
    petitionsClerkManuallyAddsCaseToTrial(cerebralTest);
    petitionsClerkViewsNewTrialSession(cerebralTest);
    markAllCasesAsQCed(cerebralTest, () => [cerebralTest.docketNumber]);
    petitionsClerkSetsATrialSessionsSchedule(cerebralTest);
  });

  describe('verify the docket record has the NTD WITHOUT clinic letter appended (1 page total)', () => {
    userVerifiesLengthOfDocketEntry(cerebralTest, 'NTD', 1);
  });
});
