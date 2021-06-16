const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  CASE_STATUS_TYPES,
  CHIEF_JUDGE,
  ROLES,
} = require('../../entities/EntityConstants');
const {
  generateCaseInventoryReportPdf,
} = require('./generateCaseInventoryReportPdf');

const mockCases = [
  {
    associatedJudge: CHIEF_JUDGE,
    docketNumber: '101-19',
    status: CASE_STATUS_TYPES.new,
  },
  {
    associatedJudge: CHIEF_JUDGE,
    docketNumber: '101-20',
    status: CASE_STATUS_TYPES.new,
  },
];

describe('generateCaseInventoryReportPdf', () => {
  let user;

  beforeEach(() => {
    user = { role: ROLES.petitionsClerk, userId: 'petitionsClerk' };

    applicationContext.getCurrentUser.mockReturnValue(user);

    applicationContext
      .getUseCaseHelpers()
      .saveFileAndGenerateUrl.mockReturnValue({
        url: 'https://www.example.com',
      });
  });

  it('throws an error if the user is unauthorized', async () => {
    user = { role: ROLES.petitioner, userId: 'petitioner' };

    applicationContext.getCurrentUser.mockReturnValue(user);
    await expect(
      generateCaseInventoryReportPdf({
        applicationContext,
        cases: mockCases,
        filters: { associatedJudge: CHIEF_JUDGE },
      }),
    ).rejects.toThrow('Unauthorized for case inventory report');
  });

  it('calls the pdf report generator', async () => {
    await generateCaseInventoryReportPdf({
      applicationContext,
      cases: mockCases,
      filters: { associatedJudge: CHIEF_JUDGE },
    });

    expect(
      applicationContext.getDocumentGenerators().caseInventoryReport,
    ).toHaveBeenCalled();
  });

  it('returns the pre-signed url to the document', async () => {
    const result = await generateCaseInventoryReportPdf({
      applicationContext,
      cases: mockCases,
      filters: { associatedJudge: CHIEF_JUDGE },
    });

    expect(result).toEqual({ url: 'https://www.example.com' });
  });

  it('should catch, log, and rethrow an error thrown by the generator', async () => {
    applicationContext
      .getDocumentGenerators()
      .caseInventoryReport.mockRejectedValue(new Error('bad!'));

    await expect(
      generateCaseInventoryReportPdf({
        applicationContext,
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
