import { docketClerkAddsPaperFiledPendingDocketEntryAndSavesForLater } from './journey/docketClerkAddsPaperFiledPendingDocketEntryAndSavesForLater';
import { docketClerkAddsPaperFiledPendingDocketEntryAndServes } from './journey/docketClerkAddsPaperFiledPendingDocketEntryAndServes';
import {
  docketClerkLoadsPendingReportOnChiefJudgeSelection,
  loginAs,
  setupTest,
  uploadPetition,
  uploadProposedStipulatedDecision,
  verifySortedReceivedAtDateOfPendingItems,
  viewCaseDetail,
} from './helpers';
import {
  formatDateString,
  subtractISODates,
} from '../../shared/src/business/utilities/DateHandler';
import { formattedCaseDetail as formattedCaseDetailComputed } from '../src/presenter/computeds/formattedCaseDetail';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../src/withAppContext';

describe('docket clerk interacts with pending items', () => {
  let caseDetail;
  let pendingItemsCount;
  let pendingItems;

  const formattedCaseDetail = withAppContextDecorator(
    formattedCaseDetailComputed,
  );

  const cerebralTest = setupTest();

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('login as a petitioner and create a case', async () => {
    caseDetail = await uploadPetition(cerebralTest);

    expect(caseDetail.docketNumber).toBeDefined();

    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  it('login as a docket clerk and check pending items count', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: caseDetail.docketNumber,
    });

    const formatted = runCompute(formattedCaseDetail, {
      state: cerebralTest.getState(),
    });

    await docketClerkLoadsPendingReportOnChiefJudgeSelection({
      cerebralTest,
      shouldLoadMore: true,
    });

    pendingItemsCount = (
      cerebralTest.getState('pendingReports.pendingItems') || []
    ).length;

    expect(formatted.pendingItemsDocketEntries.length).toEqual(0);
  });

  docketClerkAddsPaperFiledPendingDocketEntryAndSavesForLater(cerebralTest);
  it('docket clerk checks pending items count has not increased for a docket entry saved for later', async () => {
    const formatted = runCompute(formattedCaseDetail, {
      state: cerebralTest.getState(),
    });

    expect(formatted.pendingItemsDocketEntries.length).toEqual(0);
    await docketClerkLoadsPendingReportOnChiefJudgeSelection({
      cerebralTest,
      shouldLoadMore: true,
    });

    const currentPendingItemsCount = (
      cerebralTest.getState('pendingReports.pendingItems') || []
    ).length;

    expect(currentPendingItemsCount).toEqual(pendingItemsCount);
  });

  let yearBeforeEarliestPendingItem = '';
  loginAs(cerebralTest, 'irspractitioner@example.com');
  it('respondent uploads a proposed stipulated decision', async () => {
    pendingItems = cerebralTest.getState('pendingReports.pendingItems');
    const firstPendingItemDate = pendingItems[0].receivedAt;

    yearBeforeEarliestPendingItem = subtractISODates(firstPendingItemDate, {
      years: 1,
    });

    await uploadProposedStipulatedDecision(cerebralTest, {
      receivedAt: yearBeforeEarliestPendingItem,
    });
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  it('docket clerk checks pending items count has increased and views pending document', async () => {
    await viewCaseDetail({
      cerebralTest,
      docketNumber: caseDetail.docketNumber,
    });

    const formatted = runCompute(formattedCaseDetail, {
      state: cerebralTest.getState(),
    });

    expect(formatted.pendingItemsDocketEntries.length).toEqual(1);

    await docketClerkLoadsPendingReportOnChiefJudgeSelection({
      cerebralTest,
      shouldLoadMore: true,
    });

    const currentPendingItemsCount = (
      cerebralTest.getState('pendingReports.pendingItems') || []
    ).length;

    const caseReceivedAtDate = cerebralTest.getState('caseDetail.receivedAt');

    pendingItems = cerebralTest.getState('pendingReports.pendingItems');
    const firstPendingItemReceivedAtDate = pendingItems[0].receivedAt;

    expect(caseReceivedAtDate).not.toEqual(firstPendingItemReceivedAtDate);

    expect(currentPendingItemsCount).toBeGreaterThan(pendingItemsCount);

    await cerebralTest.runSequence(
      'changeTabAndSetViewerDocumentToDisplaySequence',
      {
        docketRecordTab: 'documentView',
        viewerDocumentToDisplay: {
          docketEntryId: formatted.pendingItemsDocketEntries[0].docketEntryId,
        },
      },
    );

    expect(
      cerebralTest.getState('currentViewMetadata.caseDetail.docketRecordTab'),
    ).toEqual('documentView');
  });

  it('docket clerk confirms that the proposed decision with the earliest date appears as the first pending item', async () => {
    await docketClerkLoadsPendingReportOnChiefJudgeSelection({
      cerebralTest,
    });

    pendingItems = cerebralTest.getState('pendingReports.pendingItems');
    const firstPendingItemReceivedAtDate = pendingItems[0].receivedAt;

    expect(firstPendingItemReceivedAtDate).toEqual(
      yearBeforeEarliestPendingItem,
    );
  });

  docketClerkAddsPaperFiledPendingDocketEntryAndServes(cerebralTest, 'EVID');

  it('docket clerk views a pending report item and confirms the correct receivedAt date format', async () => {
    await docketClerkLoadsPendingReportOnChiefJudgeSelection({
      cerebralTest,
      shouldLoadMore: true,
    });

    const caseReceivedAtDate = cerebralTest.getState('caseDetail.receivedAt');
    pendingItems = cerebralTest.getState('pendingReports.pendingItems');
    const pendingItem = pendingItems.find(
      item => item.docketEntryId === cerebralTest.docketEntryId,
    );

    expect(pendingItem).toBeDefined();

    const answerPendingReceivedAtFormatted = formatDateString(
      pendingItem.receivedAt,
      'MMDDYYYY',
    );
    const caseReceivedAtFormatted = formatDateString(
      caseReceivedAtDate,
      'MMDDYYYY',
    );

    expect(answerPendingReceivedAtFormatted).not.toEqual(
      caseReceivedAtFormatted,
    );
    expect(answerPendingReceivedAtFormatted).toEqual('04/30/2001');
  });

  docketClerkAddsPaperFiledPendingDocketEntryAndServes(cerebralTest, 'MOTR');

  it('docket clerk views pending motion to proceed remotely', async () => {
    await docketClerkLoadsPendingReportOnChiefJudgeSelection({
      cerebralTest,
    });

    pendingItems = cerebralTest.getState('pendingReports.pendingItems');
    const pendingMOTRItem = pendingItems.find(
      item => item.docketEntryId === cerebralTest.docketEntryId,
    );

    expect(pendingMOTRItem).toBeDefined();
  });

  it('docket clerk checks that pendingItems are sorted chronologically by receivedAt dates', async () => {
    await docketClerkLoadsPendingReportOnChiefJudgeSelection({
      cerebralTest,
      shouldLoadMore: true,
    });

    pendingItems = cerebralTest.getState('pendingReports.pendingItems');
    const sortedReceivedAtDates =
      verifySortedReceivedAtDateOfPendingItems(pendingItems);

    expect(sortedReceivedAtDates).toEqual(true);
  });
});
