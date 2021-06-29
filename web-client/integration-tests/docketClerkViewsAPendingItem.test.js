import { docketClerkAddsPaperFiledPendingDocketEntryAndSavesForLater } from './journey/docketClerkAddsPaperFiledPendingDocketEntryAndSavesForLater';
import { docketClerkAddsPaperFiledPendingDocketEntryAndServes } from './journey/docketClerkAddsPaperFiledPendingDocketEntryAndServes';
import {
  fakeFile,
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
  uploadProposedStipulatedDecision,
  viewCaseDetail,
} from './helpers';
import { formatDateString } from '../../shared/src/business/utilities/DateHandler';
import { formattedCaseDetail as formattedCaseDetailComputed } from '../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

const test = setupTest();

describe('a docket clerk uploads a pending item and sees that it is pending', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
    global.window.pdfjsObj = {
      getData: () => {
        return new Promise(resolve => {
          resolve(new Uint8Array(fakeFile));
        });
      },
    };
  });

  afterAll(() => {
    test.closeSocket();
  });

  let caseDetail;
  let pendingItemsCount;

  loginAs(test, 'petitioner@example.com');
  it('login as a petitioner and create a case', async () => {
    caseDetail = await uploadPetition(test);
    expect(caseDetail.docketNumber).toBeDefined();
  });

  loginAs(test, 'docketclerk@example.com');
  it('login as a docket clerk and check pending items count', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: caseDetail.docketNumber,
    });
    const formatted = runCompute(formattedCaseDetail, {
      state: test.getState(),
    });

    await test.runSequence('gotoPendingReportSequence');

    await test.runSequence('setPendingReportSelectedJudgeSequence', {
      judge: 'Chief Judge',
    });

    pendingItemsCount = (test.getState('pendingReports.pendingItems') || [])
      .length;

    expect(formatted.pendingItemsDocketEntries.length).toEqual(0);
  });

  docketClerkAddsPaperFiledPendingDocketEntryAndSavesForLater(test);
  it('docket clerk checks pending items count has not increased for a docket entry saved for later', async () => {
    await viewCaseDetail({
      docketNumber: caseDetail.docketNumber,
      test,
    });
    const formatted = runCompute(formattedCaseDetail, {
      state: test.getState(),
    });

    expect(formatted.pendingItemsDocketEntries.length).toEqual(0);

    await refreshElasticsearchIndex();

    await test.runSequence('gotoPendingReportSequence');

    await test.runSequence('setPendingReportSelectedJudgeSequence', {
      judge: 'Chief Judge',
    });

    const currentPendingItemsCount = (
      test.getState('pendingReports.pendingItems') || []
    ).length;

    expect(currentPendingItemsCount).toEqual(pendingItemsCount);
  });

  loginAs(test, 'irsPractitioner@example.com');
  it('respondent uploads a proposed stipulated decision', async () => {
    await viewCaseDetail({
      docketNumber: caseDetail.docketNumber,
      test,
    });
    await uploadProposedStipulatedDecision(test);
  });

  loginAs(test, 'docketclerk@example.com');
  it('docket clerk checks pending items count has increased and views pending document', async () => {
    await viewCaseDetail({
      docketNumber: caseDetail.docketNumber,
      test,
    });
    const formatted = runCompute(formattedCaseDetail, {
      state: test.getState(),
    });

    expect(formatted.pendingItemsDocketEntries.length).toEqual(1);

    await refreshElasticsearchIndex();

    await test.runSequence('gotoPendingReportSequence');

    await test.runSequence('setPendingReportSelectedJudgeSequence', {
      judge: 'Chief Judge',
    });

    const currentPendingItemsCount = (
      test.getState('pendingReports.pendingItems') || []
    ).length;

    const caseReceivedAtDate = test.getState('caseDetail.receivedAt');
    const firstPendingItemReceivedAtDate = test.getState(
      'pendingReports.pendingItems[0].receivedAt',
    );
    expect(caseReceivedAtDate).not.toEqual(firstPendingItemReceivedAtDate);

    expect(currentPendingItemsCount).toBeGreaterThan(pendingItemsCount);

    await test.runSequence('changeTabAndSetViewerDocumentToDisplaySequence', {
      docketRecordTab: 'documentView',
      viewerDocumentToDisplay: {
        docketEntryId: formatted.pendingItemsDocketEntries[0].docketEntryId,
      },
    });

    expect(
      test.getState('currentViewMetadata.caseDetail.docketRecordTab'),
    ).toEqual('documentView');
  });

  docketClerkAddsPaperFiledPendingDocketEntryAndServes(test, fakeFile);

  it('docket clerk views pending report items', async () => {
    await refreshElasticsearchIndex();

    await test.runSequence('gotoPendingReportSequence');

    await test.runSequence('setPendingReportSelectedJudgeSequence', {
      judge: 'Chief Judge',
    });

    const caseReceivedAtDate = test.getState('caseDetail.receivedAt');
    const pendingItems = test.getState('pendingReports.pendingItems');
    const pendingItem = pendingItems.find(
      item => item.docketEntryId === test.docketEntryId,
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
});
