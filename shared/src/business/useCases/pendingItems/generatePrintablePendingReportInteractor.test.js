const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  generatePrintablePendingReportInteractor,
} = require('./generatePrintablePendingReportInteractor');
const { MOCK_CASE } = require('../../../test/mockCase');
const { User } = require('../../entities/User');

describe('generatePrintablePendingReportInteractor', () => {
  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(MOCK_CASE);

    applicationContext.getStorageClient.mockReturnValue({
      upload: jest.fn((params, callback) => callback()),
    });

    applicationContext.getUseCaseHelpers().fetchPendingItems.mockReturnValue([
      {
        associatedJudge: 'Judge Armen',
        caseCaption: 'Test Caption, Petitioner',
        documentTitle: 'Test Document Title',
        receivedAt: '2020-01-01T12:00:00.000Z',
      },
      {
        associatedJudge: 'Judge Buch',
        caseCaption: 'Test Caption Two, Petitioner(s)',
        documentType: 'Test Document Type',
        receivedAt: '2020-02-02T12:00:00.000Z',
      },
    ]);

    applicationContext
      .getPersistenceGateway()
      .getDownloadPolicyUrl.mockReturnValue({ url: 'https://example.com' });
  });

  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: User.ROLES.petitionsClerk,
      userId: 'petitionsclerk',
    });
  });

  afterEach(() => {
    applicationContext.getDocumentGenerators().pendingReport.mockReset();
  });

  it('should throw an unauthorized error if the user does not have access', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: User.ROLES.petitioner,
      userId: 'petitioner',
    });

    let error;
    try {
      await generatePrintablePendingReportInteractor({
        applicationContext,
        judge: 'Armen',
      });
    } catch (err) {
      error = err;
    }
    expect(error).not.toBeNull();
    expect(error.message).toContain('Unauthorized');
  });

  it('calls the function to fetch pending items and returns result', async () => {
    const results = await generatePrintablePendingReportInteractor({
      applicationContext,
    });

    expect(
      applicationContext.getDocumentGenerators().pendingReport,
    ).toHaveBeenCalled();

    expect(results).toEqual('https://example.com');
  });

  it('should format the pending items', async () => {
    await generatePrintablePendingReportInteractor({
      applicationContext,
    });

    const {
      pendingItems,
    } = applicationContext.getDocumentGenerators().pendingReport.mock.calls[0][0].data;

    expect(pendingItems).toMatchObject([
      {
        associatedJudge: 'Judge Armen',
        associatedJudgeFormatted: 'Armen',
        caseTitle: 'Test Caption',
        formattedFiledDate: '01/01/20',
        formattedName: 'Test Document Title',
      },
      {
        associatedJudge: 'Judge Buch',
        associatedJudgeFormatted: 'Buch',
        caseTitle: 'Test Caption Two',
        formattedFiledDate: '02/02/20',
        formattedName: 'Test Document Type',
      },
    ]);
  });

  it('should generate a subtitle with All Judges if no judge filter is applied', async () => {
    await generatePrintablePendingReportInteractor({ applicationContext });

    const {
      subtitle,
    } = applicationContext.getDocumentGenerators().pendingReport.mock.calls[0][0].data;

    expect(subtitle).toEqual('All Judges');
  });

  it('should generate a subtitle with the judge name if a judge filter is applied', async () => {
    await generatePrintablePendingReportInteractor({
      applicationContext,
      judge: 'Armen',
    });

    const {
      subtitle,
    } = applicationContext.getDocumentGenerators().pendingReport.mock.calls[0][0].data;

    expect(subtitle).toEqual('Judge Armen');
  });

  it('should get case information from persistence and generate a subtitle with the docket number if a caseId is present', async () => {
    await generatePrintablePendingReportInteractor({
      applicationContext,
      caseId: '123',
    });

    const {
      subtitle,
    } = applicationContext.getDocumentGenerators().pendingReport.mock.calls[0][0].data;

    expect(subtitle).toEqual(`Docket ${MOCK_CASE.docketNumber}`);
  });

  it('calls the document generator function', async () => {
    await generatePrintablePendingReportInteractor({
      applicationContext,
    });

    expect(
      applicationContext.getDocumentGenerators().pendingReport,
    ).toHaveBeenCalled();
  });

  it('uploads the pdf to s3', async () => {
    await generatePrintablePendingReportInteractor({
      applicationContext,
    });

    expect(applicationContext.getStorageClient).toHaveBeenCalled();
    expect(applicationContext.getStorageClient().upload).toHaveBeenCalled();
  });

  it('should return the document url', async () => {
    const results = await generatePrintablePendingReportInteractor({
      applicationContext,
    });

    expect(
      applicationContext.getPersistenceGateway().getDownloadPolicyUrl,
    ).toHaveBeenCalled();
    expect(results).toEqual('https://example.com');
  });
});
