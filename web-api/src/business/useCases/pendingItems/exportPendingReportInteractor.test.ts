import '@web-api/persistence/postgres/cases/mocks.jest';
jest.mock('csv-stringify/sync');
import {
  CASE_STATUS_TYPES,
  DOCKET_NUMBER_SUFFIXES,
} from '@shared/business/entities/EntityConstants';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { exportPendingReportInteractor } from '@web-api/business/useCases/pendingItems/exportPendingReportInteractor';
import { fetchPendingItems as fetchPendingItemsMock } from '@web-api/persistence/postgres/cases/reports/fetchPendingItems';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { stringify } from 'csv-stringify/sync';

describe('exportPendingReportInteractor', () => {
  const fetchPendingItems = fetchPendingItemsMock as jest.Mock;

  const judge = 'Colvin';

  const mockFoundDocuments = [
    {
      associatedJudge: 'Judge Judgey',
      caseCaption: 'Test Caption, Petitioner',
      docketNumber: '456-68',
      docketNumberWithSuffix: '456-68',
      documentTitle: 'Test Document Best',
      receivedAt: '2022-02-04T12:00:00.000Z',
      status: CASE_STATUS_TYPES.new,
    },
    {
      associatedJudge: 'Judge Judger',
      caseCaption: 'Test Caption, Petitioner',
      docketNumber: '456-69',
      docketNumberWithSuffix: '456-69',
      documentTitle: 'Test Document Best',
      receivedAt: '2021-03-04T12:00:00.000Z',
      status: CASE_STATUS_TYPES.new,
    },
    {
      associatedJudge: 'Judge Foley',
      caseCaption: 'Test Caption, Petitioner',
      docketNumber: '456-67',
      docketNumberWithSuffix: '456-67',
      documentTitle: 'Test Document Best',
      receivedAt: '2020-03-04T12:00:00.000Z',
      status: CASE_STATUS_TYPES.generalDocket,
    },
    {
      associatedJudge: 'Judge Colvin',
      caseCaption: 'Test Caption, Petitioner',
      docketNumber: '123-45',
      docketNumberWithSuffix: '123-45',
      documentTitle: 'Test Document Title',
      receivedAt: '1990-01-01T12:00:00.000Z',
      status: CASE_STATUS_TYPES.generalDocket,
    },
    {
      associatedJudge: 'Judge Judgeson',
      caseCaption: 'Test Caption, Petitioner',
      docketNumber: '123-49',
      docketNumberWithSuffix: '123-49',
      documentTitle: 'Test Document Title',
      receivedAt: '1999-01-01T12:00:00.000Z',
      status: CASE_STATUS_TYPES.generalDocket,
    },
    {
      associatedJudge: 'Judge Buch',
      caseCaption: 'Test Caption Two, Petitioner(s)',
      docketNumber: '234-56',
      docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
      docketNumberWithSuffix: '234-56S',
      documentType: 'Test Document Type',
      receivedAt: '2020-02-02T12:00:00.000Z',
      status: CASE_STATUS_TYPES.onAppeal,
    },
    {
      associatedJudge: 'Judge Alvin',
      caseCaption: 'Test Caption, Petitioner',
      docketNumber: '345-67',
      docketNumberWithSuffix: '345-67',
      documentTitle: 'Test Document Title',
      leadDocketNumber: '456-78',
      receivedAt: '2020-03-03T12:00:00.000Z',
      status: CASE_STATUS_TYPES.onAppeal,
    },
    {
      associatedJudge: 'Judge Buch',
      caseCaption: 'Test Caption, Petitioner',
      docketNumber: '456-78',
      docketNumberWithSuffix: '456-78',
      documentTitle: 'Fear and Trembling',
      leadDocketNumber: '456-78',
      receivedAt: '2020-03-03T12:00:00.000Z',
      status: CASE_STATUS_TYPES.onAppeal,
    },
  ];

  beforeAll(() => {
    fetchPendingItems.mockResolvedValue({
      foundDocuments: mockFoundDocuments,
    });
  });

  it('should throw an unauthorized error when the user does not have access', async () => {
    (stringify as jest.Mock).mockReturnValue('MOCK_CSV_STRING');

    await expect(
      exportPendingReportInteractor(
        applicationContext,
        {
          judge: 'Colvin',
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('should call fetchPendingItems from persistence and return a csv string of the results', async () => {
    const results = await exportPendingReportInteractor(
      applicationContext,
      {
        judge,
      },
      mockPetitionsClerkUser,
    );

    expect(fetchPendingItems).toHaveBeenCalledWith({
      applicationContext,
      judge,
    });
    expect(
      applicationContext.getUtilities().formatPendingItem,
    ).toHaveBeenCalledTimes(mockFoundDocuments.length);

    const stringifyCalls = (stringify as jest.Mock).mock.calls;
    expect(stringifyCalls.length).toEqual(1);
    expect(stringifyCalls[0][0]).toEqual([
      {
        associatedJudgeFormatted: 'Colvin',
        caseTitle: 'Test Caption',
        consolidatedIconTooltipText: '',
        docketEntryId: undefined,
        docketNumber: '123-45',
        docketNumberWithSuffix: '123-45',
        documentLink:
          '/case-detail/123-45/document-view?docketEntryId=undefined',
        formattedFiledDate: '01/01/90',
        formattedName: 'Test Document Title',
        formattedStatus: 'General Docket - Not at Issue',
        inConsolidatedGroup: false,
        isLeadCase: false,
        receivedAt: '1990-01-01T12:00:00.000Z',
        shouldIndent: false,
      },
      {
        associatedJudgeFormatted: 'Judgeson',
        caseTitle: 'Test Caption',
        consolidatedIconTooltipText: '',
        docketEntryId: undefined,
        docketNumber: '123-49',
        docketNumberWithSuffix: '123-49',
        documentLink:
          '/case-detail/123-49/document-view?docketEntryId=undefined',
        formattedFiledDate: '01/01/99',
        formattedName: 'Test Document Title',
        formattedStatus: 'General Docket - Not at Issue',
        inConsolidatedGroup: false,
        isLeadCase: false,
        receivedAt: '1999-01-01T12:00:00.000Z',
        shouldIndent: false,
      },
      {
        associatedJudgeFormatted: 'Buch',
        caseTitle: 'Test Caption Two',
        consolidatedIconTooltipText: '',
        docketEntryId: undefined,
        docketNumber: '234-56',
        docketNumberWithSuffix: '234-56S',
        documentLink:
          '/case-detail/234-56/document-view?docketEntryId=undefined',
        formattedFiledDate: '02/02/20',
        formattedName: 'Test Document Type',
        formattedStatus: 'On Appeal',
        inConsolidatedGroup: false,
        isLeadCase: false,
        receivedAt: '2020-02-02T12:00:00.000Z',
        shouldIndent: false,
      },
      {
        associatedJudgeFormatted: 'Alvin',
        caseTitle: 'Test Caption',
        consolidatedIconTooltipText: 'Consolidated case',
        docketEntryId: undefined,
        docketNumber: '345-67',
        docketNumberWithSuffix: '345-67',
        documentLink:
          '/case-detail/345-67/document-view?docketEntryId=undefined',
        formattedFiledDate: '03/03/20',
        formattedName: 'Test Document Title',
        formattedStatus: 'On Appeal',
        inConsolidatedGroup: true,
        isLeadCase: false,
        receivedAt: '2020-03-03T12:00:00.000Z',
        shouldIndent: false,
      },
      {
        associatedJudgeFormatted: 'Buch',
        caseTitle: 'Test Caption',
        consolidatedIconTooltipText: 'Lead case',
        docketEntryId: undefined,
        docketNumber: '456-78',
        docketNumberWithSuffix: '456-78',
        documentLink:
          '/case-detail/456-78/document-view?docketEntryId=undefined',
        formattedFiledDate: '03/03/20',
        formattedName: 'Fear and Trembling',
        formattedStatus: 'On Appeal',
        inConsolidatedGroup: true,
        isLeadCase: true,
        receivedAt: '2020-03-03T12:00:00.000Z',
        shouldIndent: false,
      },
      {
        associatedJudgeFormatted: 'Foley',
        caseTitle: 'Test Caption',
        consolidatedIconTooltipText: '',
        docketEntryId: undefined,
        docketNumber: '456-67',
        docketNumberWithSuffix: '456-67',
        documentLink:
          '/case-detail/456-67/document-view?docketEntryId=undefined',
        formattedFiledDate: '03/04/20',
        formattedName: 'Test Document Best',
        formattedStatus: 'General Docket - Not at Issue',
        inConsolidatedGroup: false,
        isLeadCase: false,
        receivedAt: '2020-03-04T12:00:00.000Z',
        shouldIndent: false,
      },
      {
        associatedJudgeFormatted: 'Judger',
        caseTitle: 'Test Caption',
        consolidatedIconTooltipText: '',
        docketEntryId: undefined,
        docketNumber: '456-69',
        docketNumberWithSuffix: '456-69',
        documentLink:
          '/case-detail/456-69/document-view?docketEntryId=undefined',
        formattedFiledDate: '03/04/21',
        formattedName: 'Test Document Best',
        formattedStatus: 'New',
        inConsolidatedGroup: false,
        isLeadCase: false,
        receivedAt: '2021-03-04T12:00:00.000Z',
        shouldIndent: false,
      },
      {
        associatedJudgeFormatted: 'Judgey',
        caseTitle: 'Test Caption',
        consolidatedIconTooltipText: '',
        docketEntryId: undefined,
        docketNumber: '456-68',
        docketNumberWithSuffix: '456-68',
        documentLink:
          '/case-detail/456-68/document-view?docketEntryId=undefined',
        formattedFiledDate: '02/04/22',
        formattedName: 'Test Document Best',
        formattedStatus: 'New',
        inConsolidatedGroup: false,
        isLeadCase: false,
        receivedAt: '2022-02-04T12:00:00.000Z',
        shouldIndent: false,
      },
    ]);
    expect(results).toEqual('MOCK_CSV_STRING');
  });
});
