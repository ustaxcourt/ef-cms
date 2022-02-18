const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  DOCKET_NUMBER_SUFFIXES,
  ROLES,
} = require('../../entities/EntityConstants');
const {
  generatePrintablePendingReportInteractor,
} = require('./generatePrintablePendingReportInteractor');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('generatePrintablePendingReportInteractor', () => {
  let mockUser;

  const mockFoundDocuments = [
    {
      associatedJudge: 'Judge Foley',
      docketNumber: '456-67',
      documentTitle: 'Test Document Best',
      receivedAt: '2020-03-04T12:00:00.000Z',
    },
    {
      associatedJudge: 'Judge Colvin',
      caseCaption: 'Test Caption, Petitioner',
      docketNumber: '123-45',
      documentTitle: 'Test Document Title',
      receivedAt: '2020-01-01T12:00:00.000Z',
    },
    {
      associatedJudge: 'Judge Buch',
      caseCaption: 'Test Caption Two, Petitioner(s)',
      docketNumber: '234-56',
      docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
      documentType: 'Test Document Type',
      receivedAt: '2020-02-02T12:00:00.000Z',
    },
    {
      associatedJudge: 'Judge Alvin',
      docketNumber: '345-67',
      documentTitle: 'Test Document Title',
      receivedAt: '2020-03-03T12:00:00.000Z',
    },
  ];

  beforeAll(() => {
    applicationContext.getStorageClient.mockReturnValue({
      upload: jest.fn((params, callback) => callback()),
    });

    applicationContext
      .getPersistenceGateway()
      .fetchPendingItems.mockReturnValue({
        foundDocuments: mockFoundDocuments,
      });

    applicationContext
      .getUseCaseHelpers()
      .fetchPendingItemsByDocketNumber.mockReturnValue(mockFoundDocuments);

    applicationContext
      .getPersistenceGateway()
      .getDownloadPolicyUrl.mockReturnValue({ url: 'https://example.com' });
  });

  beforeEach(() => {
    mockUser = {
      role: ROLES.petitionsClerk,
      userId: 'petitionsclerk',
    };

    applicationContext.getCurrentUser.mockImplementation(() => mockUser);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);
  });

  afterEach(() => {
    applicationContext.getDocumentGenerators().pendingReport.mockReset();
  });

  it('should throw an unauthorized error when the user does not have access', async () => {
    mockUser = {
      role: ROLES.petitioner,
      userId: 'petitioner',
    };

    await expect(
      generatePrintablePendingReportInteractor(applicationContext, {
        judge: 'Colvin',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should call fetchPendingItems from persistence and return the results', async () => {
    const results = await generatePrintablePendingReportInteractor(
      applicationContext,
      {},
    );

    expect(
      applicationContext.getPersistenceGateway().fetchPendingItems,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getDocumentGenerators().pendingReport,
    ).toHaveBeenCalled();
    expect(results).toEqual('https://example.com');
  });

  it('should format the pending items', async () => {
    await generatePrintablePendingReportInteractor(applicationContext, {});

    const { pendingItems } =
      applicationContext.getDocumentGenerators().pendingReport.mock.calls[0][0]
        .data;

    expect(pendingItems).toMatchObject([
      {
        associatedJudge: 'Judge Colvin',
        associatedJudgeFormatted: 'Colvin',
        caseTitle: 'Test Caption',
        docketNumberWithSuffix: '123-45',
        formattedFiledDate: '01/01/20',
        formattedName: 'Test Document Title',
      },
      {
        associatedJudge: 'Judge Buch',
        associatedJudgeFormatted: 'Buch',
        caseTitle: 'Test Caption Two',
        docketNumberWithSuffix: '234-56S',
        formattedFiledDate: '02/02/20',
        formattedName: 'Test Document Type',
      },
      {
        associatedJudge: 'Judge Alvin',
        caseTitle: '',
        docketNumber: '345-67',
        documentTitle: 'Test Document Title',
        receivedAt: '2020-03-03T12:00:00.000Z',
      },
      {
        associatedJudge: 'Judge Foley',
        associatedJudgeFormatted: 'Foley',
        caseTitle: '',
        docketNumber: '456-67',
        docketNumberWithSuffix: '456-67',
        documentTitle: 'Test Document Best',
        formattedFiledDate: '03/04/20',
        formattedName: 'Test Document Best',
        receivedAt: '2020-03-04T12:00:00.000Z',
      },
    ]);
  });

  it('should generate a subtitle with All Judges if no judge filter is applied', async () => {
    await generatePrintablePendingReportInteractor(applicationContext, {});

    const { subtitle } =
      applicationContext.getDocumentGenerators().pendingReport.mock.calls[0][0]
        .data;
    expect(subtitle).toEqual('All Judges');
  });

  it('should generate a subtitle with the judge name if a judge filter is applied', async () => {
    await generatePrintablePendingReportInteractor(applicationContext, {
      judge: 'Colvin',
    });

    const { subtitle } =
      applicationContext.getDocumentGenerators().pendingReport.mock.calls[0][0]
        .data;
    expect(subtitle).toEqual('Judge Colvin');
  });

  it('should get case information from persistence and generate a subtitle with the docket number if a docketNumber is present', async () => {
    await generatePrintablePendingReportInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });

    const { subtitle } =
      applicationContext.getDocumentGenerators().pendingReport.mock.calls[0][0]
        .data;

    expect(subtitle).toEqual(`Docket ${MOCK_CASE.docketNumber}`);
  });

  it('should generate a subtitle with the docket number suffix if present', async () => {
    MOCK_CASE.docketNumberSuffix = DOCKET_NUMBER_SUFFIXES.WHISTLEBLOWER;

    await generatePrintablePendingReportInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });

    const { subtitle } =
      applicationContext.getDocumentGenerators().pendingReport.mock.calls[0][0]
        .data;
    expect(subtitle).toEqual(`Docket ${MOCK_CASE.docketNumber}W`);
  });

  it('calls the document generator function', async () => {
    await generatePrintablePendingReportInteractor(applicationContext, {});

    expect(
      applicationContext.getDocumentGenerators().pendingReport,
    ).toHaveBeenCalled();
  });

  it('uploads the pdf to s3', async () => {
    await generatePrintablePendingReportInteractor(applicationContext, {});

    expect(applicationContext.getStorageClient).toHaveBeenCalled();
    expect(applicationContext.getStorageClient().upload).toHaveBeenCalled();
  });

  it('should return the document url', async () => {
    const results = await generatePrintablePendingReportInteractor(
      applicationContext,
      {},
    );

    expect(
      applicationContext.getPersistenceGateway().getDownloadPolicyUrl,
    ).toHaveBeenCalled();
    expect(results).toEqual('https://example.com');
  });

  it('fails and logs if the s3 upload fails', async () => {
    applicationContext.getStorageClient.mockReturnValue({
      upload: (params, callback) => callback('error'),
    });

    await expect(
      generatePrintablePendingReportInteractor(applicationContext, {}),
    ).rejects.toEqual('error');
    expect(applicationContext.logger.error).toHaveBeenCalled();
    expect(applicationContext.logger.error.mock.calls[0][0]).toEqual(
      'error uploading to s3',
    );
  });
});
