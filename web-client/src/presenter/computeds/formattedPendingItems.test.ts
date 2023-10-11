import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { formattedPendingItems as formattedPendingItemsComputed } from './formattedPendingItems';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

describe('formattedPendingItems', () => {
  const { CHIEF_JUDGE, DOCKET_NUMBER_SUFFIXES, STATUS_TYPES } =
    applicationContext.getConstants();

  const formattedPendingItems = withAppContextDecorator(
    formattedPendingItemsComputed,
  );

  const mockPendingItems = [
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

  it('should return formatted and sorted list of judges', () => {
    const result = runCompute(formattedPendingItems, {
      state: {
        judges: [{ name: 'Judge A' }, { name: 'Judge B' }],
      },
    });

    expect(result.judges).toEqual(['A', 'B', CHIEF_JUDGE]);
  });

  it('should return a list of formatted pending items', () => {
    const result = runCompute(formattedPendingItems, {
      state: {
        judges: [],
        pendingReports: {
          pendingItems: mockPendingItems,
        },
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

  it('should add consolidated properties to a pending item in a consolidated group', () => {
    const result = runCompute(formattedPendingItems, {
      state: {
        judges: [],
        pendingReports: {
          pendingItems: [
            {
              associatedJudge: 'Judge A',
              caseStatus: STATUS_TYPES.new,
              createdAt: '2018-01-20',
              docketEntryId: '6ad0a175-048a-475f-977c-12cb63e37c91',
              docketNumber: '104-19',
              docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.WHISTLEBLOWER,
              documentTitle: 'Administrative Record',
              documentType: 'Administrative Record',
              eventCode: 'ADMR',
              leadDocketNumber: '100-19',
              receivedAt: '2018-01-20',
            },
          ],
        },
      },
    });

    expect(result).toMatchObject({
      items: [
        {
          associatedJudge: 'Judge A',
          associatedJudgeFormatted: 'A',
          caseStatus: STATUS_TYPES.new,
          consolidatedIconTooltipText: 'Consolidated case',
          documentLink:
            '/case-detail/104-19/document-view?docketEntryId=6ad0a175-048a-475f-977c-12cb63e37c91',
          formattedFiledDate: '01/20/18',
          formattedName: 'Administrative Record',
          inConsolidatedGroup: true,
          inLeadCase: false,
          receivedAt: '2018-01-20',
        },
      ],
    });
  });

  it('appends screenMetadata.pendingItemsFilters.judge on the printUrl if one is present', () => {
    const result = runCompute(formattedPendingItems, {
      state: {
        judges: [],
        screenMetadata: { pendingItemsFilters: { judge: 'Judge Somebody' } },
      },
    });

    expect(result.printUrl).toContain('Judge%20Somebody');
  });

  it('returns default printUrl if screenMetadata.pendingItemsFilters.judge is not set', () => {
    const result = runCompute(formattedPendingItems, {
      state: {
        judges: [],
        screenMetadata: { pendingItemsFilters: {} },
      },
    });

    expect(result.printUrl).toEqual('/reports/pending-report/printable?');
  });
});
