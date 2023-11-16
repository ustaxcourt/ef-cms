import {
  PendingReports,
  initialPendingReportsState,
} from '@web-client/presenter/state/pendingReportState';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { cloneDeep } from 'lodash';
import { formattedPendingItemsHelper as formattedPendingItemsComputed } from './formattedPendingItems';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

describe('formattedPendingItems', () => {
  const { CHIEF_JUDGE, DOCKET_NUMBER_SUFFIXES, STATUS_TYPES } =
    applicationContext.getConstants();

  const formattedPendingItems = withAppContextDecorator(
    formattedPendingItemsComputed,
  );

  let mockPendingItems;
  let pendingItem;
  let pendingReportsState: PendingReports;
  beforeEach(() => {
    pendingItem = {
      associatedJudge: 'Judge A',
      createdAt: '2018-01-20',
      docketEntryId: 'dd956ab1-5cde-4e78-bae0-ac7faee40426',
      docketNumber: '103-19',
      docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.WHISTLEBLOWER,
      documentTitle: 'Affidavit of Bob in Support of Petition',
      documentType: 'Affidavit in Support',
      eventCode: 'AFF',
      receivedAt: '2018-01-20',
      status: STATUS_TYPES.calendared,
      trialDate: '2022-02-01T17:21:05.486Z',
      trialLocation: 'Houston, Texas',
    };

    mockPendingItems = [
      {
        associatedJudge: CHIEF_JUDGE,
        caseStatus: STATUS_TYPES.new,
        createdAt: '2019-01-10',
        docketEntryId: '33ddbf4f-90f8-417c-8967-57851b0b9069',
        docketNumber: '101-19',
        docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.WHISTLEBLOWER,
        documentType: 'Administrative Record',
        eventCode: 'ADMR',
        receivedAt: '2019-01-10',
      },
      {
        associatedJudge: CHIEF_JUDGE,
        caseStatus: STATUS_TYPES.new,
        createdAt: '2018-01-20',
        docketEntryId: 'dd956ab1-5cde-4e78-bae0-fff4aee40426',
        docketNumber: '101-19',
        docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.WHISTLEBLOWER,
        documentTitle: 'Affidavit of Sally in Support of Petition',
        documentType: 'Affidavit in Support',
        eventCode: 'AFF',
        receivedAt: '2018-01-20',
      },
      {
        associatedJudge: 'Judge A',
        caseStatus: STATUS_TYPES.new,
        createdAt: '2018-01-20',
        docketEntryId: 'dd956ab1-5cde-4e78-bae0-ac7faee40426',
        docketNumber: '103-19',
        docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.WHISTLEBLOWER,
        documentTitle: 'Affidavit of Bob in Support of Petition',
        documentType: 'Affidavit in Support',
        eventCode: 'AFF',
        receivedAt: '2018-01-20',
      },
    ];

    pendingReportsState = cloneDeep(initialPendingReportsState);
    pendingReportsState.pendingItems = mockPendingItems;
  });

  it('should return formatted and sorted list of judges', () => {
    const result = runCompute(formattedPendingItems, {
      state: {
        judges: [{ name: 'Judge A' }, { name: 'Judge B' }],
        pendingReports: pendingReportsState,
      },
    });

    expect(result.judges).toEqual(['A', 'B', CHIEF_JUDGE]);
  });

  it('should return a list of formatted pending items', () => {
    const result = runCompute(formattedPendingItems, {
      state: {
        judges: [],
        pendingReports: pendingReportsState,
      },
    });

    expect(result).toMatchObject({
      items: [
        {
          associatedJudge: CHIEF_JUDGE,
          associatedJudgeFormatted: CHIEF_JUDGE,
          caseStatus: STATUS_TYPES.new,
          documentLink:
            '/case-detail/101-19/document-view?docketEntryId=33ddbf4f-90f8-417c-8967-57851b0b9069',
          formattedFiledDate: '01/10/19',
          formattedName: 'Administrative Record',
          receivedAt: '2019-01-10',
        },
        {
          associatedJudge: CHIEF_JUDGE,
          associatedJudgeFormatted: CHIEF_JUDGE,
          caseStatus: STATUS_TYPES.new,
          documentLink:
            '/case-detail/101-19/document-view?docketEntryId=dd956ab1-5cde-4e78-bae0-fff4aee40426',
          formattedFiledDate: '01/20/18',
          formattedName: 'Affidavit of Sally in Support of Petition',
          receivedAt: '2018-01-20',
        },
        {
          associatedJudge: 'Judge A',
          associatedJudgeFormatted: 'A',
          caseStatus: STATUS_TYPES.new,
          documentLink:
            '/case-detail/103-19/document-view?docketEntryId=dd956ab1-5cde-4e78-bae0-ac7faee40426',
          formattedFiledDate: '01/20/18',
          formattedName: 'Affidavit of Bob in Support of Petition',
          receivedAt: '2018-01-20',
        },
      ],
    });
  });

  it('should add the trial location and trial date to the case status for pending items on cases that are calendared', () => {
    pendingItem.status = STATUS_TYPES.calendared;
    pendingItem.trialDate = '2022-02-01T17:21:05.486Z';
    pendingItem.trialLocation = 'Houston, Texas';
    pendingReportsState.pendingItems = [pendingItem];

    const result = runCompute(formattedPendingItems, {
      state: {
        judges: [],
        pendingReports: pendingReportsState,
      },
    });

    expect(result.items[0].formattedStatus).toEqual(
      `${STATUS_TYPES.calendared} - 02/01/22 Houston, TX`,
    );
  });

  it('should add consolidated properties to a pending item in a consolidated group', () => {
    pendingItem.leadDocketNumber = '100-19';
    pendingReportsState.pendingItems = [pendingItem];

    const result = runCompute(formattedPendingItems, {
      state: {
        judges: [],
        pendingReports: pendingReportsState,
      },
    });

    expect(result).toMatchObject({
      items: [
        {
          inConsolidatedGroup: true,
          inLeadCase: false,
          leadDocketNumber: '100-19',
        },
      ],
    });
  });

  it('appends screenMetadata.pendingItemsFilters.judge on the printUrl if one is present', () => {
    const result = runCompute(formattedPendingItems, {
      state: {
        judges: [],
        pendingReports: pendingReportsState,
        screenMetadata: { pendingItemsFilters: { judge: 'Judge Somebody' } },
      },
    });

    expect(result.printUrl).toContain('Judge%20Somebody');
  });

  it('returns default printUrl if screenMetadata.pendingItemsFilters.judge is not set', () => {
    const result = runCompute(formattedPendingItems, {
      state: {
        judges: [],
        pendingReports: pendingReportsState,
        screenMetadata: { pendingItemsFilters: {} },
      },
    });

    expect(result.printUrl).toEqual('/reports/pending-report/printable?');
  });
});
