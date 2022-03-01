import { DateTime, Duration } from 'luxon';
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

describe('a docket clerk uploads a pending item and sees that it is pending', () => {
  let caseDetail;
  let pendingItemsCount;

  const formattedCaseDetail = withAppContextDecorator(
    formattedCaseDetailComputed,
  );

  const cerebralTest = setupTest();

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
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('login as a petitioner and create a case', async () => {
    caseDetail = await uploadPetition(cerebralTest);
    expect(caseDetail.docketNumber).toBeDefined();
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  it('login as a docket clerk and check pending items count', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: caseDetail.docketNumber,
    });
    const formatted = runCompute(formattedCaseDetail, {
      state: cerebralTest.getState(),
    });

    await cerebralTest.runSequence('gotoPendingReportSequence');

    await cerebralTest.runSequence('setPendingReportSelectedJudgeSequence', {
      judge: 'Chief Judge',
    });

    pendingItemsCount = (
      cerebralTest.getState('pendingReports.pendingItems') || []
    ).length;

    expect(formatted.pendingItemsDocketEntries.length).toEqual(0);
  });

  docketClerkAddsPaperFiledPendingDocketEntryAndSavesForLater(cerebralTest);
  it('docket clerk checks pending items count has not increased for a docket entry saved for later', async () => {
    await viewCaseDetail({
      cerebralTest,
      docketNumber: caseDetail.docketNumber,
    });
    const formatted = runCompute(formattedCaseDetail, {
      state: cerebralTest.getState(),
    });

    expect(formatted.pendingItemsDocketEntries.length).toEqual(0);

    await refreshElasticsearchIndex();

    await cerebralTest.runSequence('gotoPendingReportSequence');

    await cerebralTest.runSequence('setPendingReportSelectedJudgeSequence', {
      judge: 'Chief Judge',
    });

    const currentPendingItemsCount = (
      cerebralTest.getState('pendingReports.pendingItems') || []
    ).length;

    expect(currentPendingItemsCount).toEqual(pendingItemsCount);
  });

  loginAs(cerebralTest, 'irsPractitioner@example.com');
  it('respondent uploads a proposed stipulated decision', async () => {
    await viewCaseDetail({
      cerebralTest,
      docketNumber: caseDetail.docketNumber,
    });
    await uploadProposedStipulatedDecision(cerebralTest);
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

    await refreshElasticsearchIndex();

    await cerebralTest.runSequence('gotoPendingReportSequence');

    await cerebralTest.runSequence('setPendingReportSelectedJudgeSequence', {
      judge: 'Chief Judge',
    });

    const currentPendingItemsCount = (
      cerebralTest.getState('pendingReports.pendingItems') || []
    ).length;

    const caseReceivedAtDate = cerebralTest.getState('caseDetail.receivedAt');
    const firstPendingItemReceivedAtDate = cerebralTest.getState(
      'pendingReports.pendingItems[0].receivedAt',
    );
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

  docketClerkAddsPaperFiledPendingDocketEntryAndServes(
    cerebralTest,
    fakeFile,
    'EVID',
  );

  it('docket clerk views pending report items', async () => {
    await refreshElasticsearchIndex();

    await cerebralTest.runSequence('gotoPendingReportSequence');

    await cerebralTest.runSequence('setPendingReportSelectedJudgeSequence', {
      judge: 'Chief Judge',
    });

    const caseReceivedAtDate = cerebralTest.getState('caseDetail.receivedAt');
    const pendingItems = cerebralTest.getState('pendingReports.pendingItems');
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

  docketClerkAddsPaperFiledPendingDocketEntryAndServes(
    cerebralTest,
    fakeFile,
    'MOTR',
  );

  it('docket clerk views pending motion to proceed remotely', async () => {
    await refreshElasticsearchIndex();

    await cerebralTest.runSequence('gotoPendingReportSequence');

    await cerebralTest.runSequence('setPendingReportSelectedJudgeSequence', {
      judge: 'Chief Judge',
    });

    const pendingItems = cerebralTest.getState('pendingReports.pendingItems');
    const pendingMOTRItem = pendingItems.find(
      item => item.docketEntryId === cerebralTest.docketEntryId,
    );

    expect(pendingMOTRItem).toBeDefined();
  });

  describe('docket clerk views pending report items which are sorted and exceed single page count', () => {
    it('refreshes elasticsearch', async () => {
      await refreshElasticsearchIndex();
    });
    const PAGE_SIZE = 100;

    //TODO:
    // 1. Process of adding enough items to pending report to cause pagination
    loginAs(cerebralTest, 'docketclerk@example.com');
    it('docket clerk views pending motion to proceed remotely', async () => {
      await cerebralTest.runSequence('gotoPendingReportSequence');

      await cerebralTest.runSequence('setPendingReportSelectedJudgeSequence', {
        judge: 'Chief Judge',
      });

      const pendingItems = cerebralTest.getState('pendingReports.pendingItems');

      console.log('pendingItemsBefore*** ', pendingItems.length);
    });

    loginAs(cerebralTest, 'irsPractitioner@example.com');

    for (
      let pendingItemIndex = 0;
      pendingItemIndex < PAGE_SIZE;
      pendingItemIndex++
    ) {
      it(`creates pending item ${pendingItemIndex + 1}`, async () => {
        await viewCaseDetail({
          cerebralTest,
          docketNumber: caseDetail.docketNumber,
        });
        await uploadProposedStipulatedDecision(cerebralTest, {
          receivedAt: DateTime.now()
            .minus(Duration.fromObject({ days: pendingItemIndex }))
            .toISO(),
        });
      });
    }

    // 2. Look at pending report, and verify that items are sorted properly regardless of number of pages
    //  - e.g. click on load more and the items continue to be sorted correctly
    // 3. After exceeding the number of items in one page, add one more item that should be displayed as the first item
    //    on the first page if properly sorted.

    loginAs(cerebralTest, 'docketclerk@example.com');

    it('docketClerk checks pendingItems', async () => {
      await refreshElasticsearchIndex();

      await cerebralTest.runSequence('gotoPendingReportSequence');

      await cerebralTest.runSequence('setPendingReportSelectedJudgeSequence', {
        judge: 'Chief Judge',
      });

      const caseReceivedAtDate = cerebralTest.getState('caseDetail.receivedAt');
      const pendingItems = cerebralTest.getState('pendingReports.pendingItems');
      const pendingItem = pendingItems.find(
        item => item.docketEntryId === cerebralTest.docketEntryId,
      );

      console.log('pendingItemsAfter*** ', pendingItems.length);
      console.log('pendingItems*** ', pendingItems);

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
});
