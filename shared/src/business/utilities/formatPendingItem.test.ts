import {
  CASE_STATUS_TYPES,
  CHIEF_JUDGE,
  DOCKET_NUMBER_SUFFIXES,
} from '@shared/business/entities/EntityConstants';
import { PendingItem } from '@web-api/business/useCases/pendingItems/fetchPendingItemsInteractor';
import { applicationContext } from '../test/createTestApplicationContext';
import { formatPendingItem } from '@shared/business/utilities/formatPendingItem';

describe('formatPendingItem', () => {
  let mockPendingItems: PendingItem[];
  let pendingItem: PendingItem;

  beforeEach(() => {
    pendingItem = {
      associatedJudge: 'Judge A',
      caseCaption: 'bubbly',
      docketEntryId: 'dd956ab1-5cde-4e78-bae0-ac7faee40426',
      docketNumber: '103-19',
      docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.WHISTLEBLOWER,
      docketNumberWithSuffix: '103-19L',
      documentTitle: 'Affidavit of Bob in Support of Petition',
      documentType: 'Affidavit in Support',
      leadDocketNumber: undefined,
      receivedAt: '2018-01-20',
      status: CASE_STATUS_TYPES.calendared,
      trialDate: '2022-02-01T17:21:05.486Z',
      trialLocation: 'Houston, Texas',
    };

    mockPendingItems = [
      {
        associatedJudge: CHIEF_JUDGE,
        caseCaption: '',
        docketEntryId: '33ddbf4f-90f8-417c-8967-57851b0b9069',
        docketNumber: '101-19',
        docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.WHISTLEBLOWER,
        documentTitle: 'Bop dop baboo',
        documentType: 'Administrative Record',
        receivedAt: '2019-01-10',
        status: CASE_STATUS_TYPES.new,
      },
      {
        associatedJudge: CHIEF_JUDGE,
        caseCaption: '',
        docketEntryId: 'dd956ab1-5cde-4e78-bae0-fff4aee40426',
        docketNumber: '101-19',
        docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.WHISTLEBLOWER,
        documentTitle: 'Affidavit of Sally in Support of Petition',
        documentType: 'Affidavit in Support',
        receivedAt: '2018-01-20',
        status: CASE_STATUS_TYPES.new,
      },
      {
        associatedJudge: 'Judge A',
        caseCaption: '',
        docketEntryId: 'dd956ab1-5cde-4e78-bae0-ac7faee40426',
        docketNumber: '103-19',
        docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.WHISTLEBLOWER,
        documentTitle: 'Affidavit of Bob in Support of Petition',
        documentType: 'Affidavit in Support',
        receivedAt: '2018-01-20',
        status: CASE_STATUS_TYPES.new,
      },
    ];
  });

  it('should return a list of formatted pending items', () => {
    const result = mockPendingItems.map(item =>
      formatPendingItem(item, {
        applicationContext,
      }),
    );

    expect(result).toMatchObject([
      {
        associatedJudgeFormatted: CHIEF_JUDGE,
        documentLink:
          '/case-detail/101-19/document-view?docketEntryId=33ddbf4f-90f8-417c-8967-57851b0b9069',
        formattedFiledDate: '01/10/19',
        formattedName: 'Bop dop baboo',
      },
      {
        associatedJudgeFormatted: CHIEF_JUDGE,
        documentLink:
          '/case-detail/101-19/document-view?docketEntryId=dd956ab1-5cde-4e78-bae0-fff4aee40426',
        formattedFiledDate: '01/20/18',
        formattedName: 'Affidavit of Sally in Support of Petition',
      },
      {
        associatedJudgeFormatted: 'A',
        documentLink:
          '/case-detail/103-19/document-view?docketEntryId=dd956ab1-5cde-4e78-bae0-ac7faee40426',
        formattedFiledDate: '01/20/18',
        formattedName: 'Affidavit of Bob in Support of Petition',
      },
    ]);
  });

  it('should add consolidated properties to a pending item in a consolidated group', () => {
    pendingItem.leadDocketNumber = '100-19';

    const result = formatPendingItem(pendingItem, { applicationContext });

    expect(result).toMatchObject({
      inConsolidatedGroup: true,
      isLeadCase: false,
    });
  });
});
