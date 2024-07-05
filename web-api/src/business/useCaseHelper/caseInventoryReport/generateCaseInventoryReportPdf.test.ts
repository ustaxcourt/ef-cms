import {
  CASE_STATUS_TYPES,
  CASE_TYPES_MAP,
  CHIEF_JUDGE,
  PARTY_TYPES,
  PAYMENT_STATUS,
  PROCEDURE_TYPES_MAP,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { generateCaseInventoryReportPdf } from './generateCaseInventoryReportPdf';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';

describe('generateCaseInventoryReportPdf', () => {
  const mockCases: RawCase[] = [
    {
      associatedJudge: CHIEF_JUDGE,
      canAllowPrintableDocketRecord: false,
      caseCaption: 'Test Caption, Petitioner',
      caseStatusHistory: [],
      caseType: CASE_TYPES_MAP.disclosure,
      consolidatedCases: [],
      correspondence: [],
      createdAt: '2018-11-21T20:49:28.192Z',
      docketEntries: [],
      docketNumber: '101-19',
      entityName: 'Case',
      hearings: [],
      partyType: PARTY_TYPES.donor,
      petitionPaymentStatus: PAYMENT_STATUS.PAID,
      petitioners: [],
      procedureType: PROCEDURE_TYPES_MAP.regular,
      receivedAt: '2018-11-20T20:49:28.192Z',
      sortableDocketNumber: 2001000101,
      status: CASE_STATUS_TYPES.new,
    },
    {
      associatedJudge: CHIEF_JUDGE,
      canAllowPrintableDocketRecord: true,
      caseCaption: 'Test Caption Again, Petitioner',
      caseStatusHistory: [],
      caseType: CASE_TYPES_MAP.other,
      consolidatedCases: [],
      correspondence: [],
      createdAt: '2020-07-21T20:49:28.192Z',
      docketEntries: [],
      docketNumber: '101-20',
      entityName: 'Case',
      hearings: [],
      partyType: PARTY_TYPES.petitioner,
      petitionPaymentStatus: PAYMENT_STATUS.PAID,
      petitioners: [],
      procedureType: PROCEDURE_TYPES_MAP.regular,
      receivedAt: '2020-06-29T20:49:28.192Z',
      sortableDocketNumber: 2001000111,
      status: CASE_STATUS_TYPES.new,
    },
  ];

  beforeEach(() => {
    applicationContext
      .getUseCaseHelpers()
      .saveFileAndGenerateUrl.mockReturnValue({
        url: 'https://www.example.com',
      });

    applicationContext.getUtilities().setConsolidationFlagsForDisplay = jest.fn(
      item => item,
    );
  });

  it('throws an error if the user is unauthorized', async () => {
    await expect(
      generateCaseInventoryReportPdf({
        applicationContext,
        authorizedUser: mockPetitionerUser,
        cases: mockCases,
        filters: { associatedJudge: CHIEF_JUDGE },
      }),
    ).rejects.toThrow('Unauthorized for case inventory report');
  });

  it('calls the pdf report generator', async () => {
    await generateCaseInventoryReportPdf({
      applicationContext,
      authorizedUser: mockPetitionsClerkUser,
      cases: mockCases,
      filters: { associatedJudge: CHIEF_JUDGE },
    });

    expect(
      applicationContext.getDocumentGenerators().caseInventoryReport,
    ).toHaveBeenCalled();

    const setConsolidationFlagsForDisplayCalls =
      applicationContext.getUtilities().setConsolidationFlagsForDisplay.mock
        .calls.length;

    expect(setConsolidationFlagsForDisplayCalls).toEqual(mockCases.length);
  });

  it('returns the pre-signed url to the document', async () => {
    const result = await generateCaseInventoryReportPdf({
      applicationContext,
      authorizedUser: mockPetitionsClerkUser,
      cases: mockCases,
      filters: { associatedJudge: CHIEF_JUDGE },
    });

    expect(result).toEqual({ url: 'https://www.example.com' });
  });

  it('should catch, log, and rethrow an error thrown by the generator', async () => {
    applicationContext
      .getDocumentGenerators()
      .caseInventoryReport.mockRejectedValueOnce(new Error('bad!'));

    await expect(
      generateCaseInventoryReportPdf({
        applicationContext,
        authorizedUser: mockPetitionsClerkUser,
        cases: mockCases,
        filters: { associatedJudge: CHIEF_JUDGE },
      }),
    ).rejects.toThrow('bad!');
  });

  it('should hide the status column if the status filter is set', async () => {
    applicationContext
      .getDocumentGenerators()
      .caseInventoryReport.mockReturnValue(null);

    await generateCaseInventoryReportPdf({
      applicationContext,
      authorizedUser: mockPetitionsClerkUser,
      cases: mockCases,
      filters: { status: CASE_STATUS_TYPES.new },
    });

    const { showJudgeColumn, showStatusColumn } =
      applicationContext.getDocumentGenerators().caseInventoryReport.mock
        .calls[0][0].data;
    expect(showStatusColumn).toBeFalsy();
    expect(showJudgeColumn).toBeTruthy();
  });

  it('should hide the judge column if the judge filter is set', async () => {
    applicationContext
      .getDocumentGenerators()
      .caseInventoryReport.mockReturnValue(null);

    await generateCaseInventoryReportPdf({
      applicationContext,
      authorizedUser: mockPetitionsClerkUser,
      cases: mockCases,
      filters: { associatedJudge: CHIEF_JUDGE },
    });

    const { showJudgeColumn, showStatusColumn } =
      applicationContext.getDocumentGenerators().caseInventoryReport.mock
        .calls[0][0].data;
    expect(showStatusColumn).toBeTruthy();
    expect(showJudgeColumn).toBeFalsy();
  });

  it('should hide the judge and status columns if the associatedJudge and status filters are set', async () => {
    applicationContext
      .getDocumentGenerators()
      .caseInventoryReport.mockReturnValue(null);

    await generateCaseInventoryReportPdf({
      applicationContext,
      authorizedUser: mockPetitionsClerkUser,
      cases: mockCases,
      filters: {
        associatedJudge: CHIEF_JUDGE,
        status: CASE_STATUS_TYPES.new,
      },
    });

    const { showJudgeColumn, showStatusColumn } =
      applicationContext.getDocumentGenerators().caseInventoryReport.mock
        .calls[0][0].data;
    expect(showStatusColumn).toBeFalsy();
    expect(showJudgeColumn).toBeFalsy();
  });
});
