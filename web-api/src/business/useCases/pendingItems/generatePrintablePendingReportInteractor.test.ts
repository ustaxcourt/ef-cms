import {
  DOCKET_NUMBER_SUFFIXES,
  ROLES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { generatePrintablePendingReportInteractor } from './generatePrintablePendingReportInteractor';

describe('generatePrintablePendingReportInteractor', () => {
  let mockUser;

  const mockFoundDocuments = [
    {
      associatedJudge: 'Judge Judgey',
      docketNumber: '456-68',
      docketNumberWithSuffix: '456-68',
      documentTitle: 'Test Document Best',
      receivedAt: '2022-02-04T12:00:00.000Z',
    },
    {
      associatedJudge: 'Judge Judger',
      docketNumber: '456-69',
      docketNumberWithSuffix: '456-69',
      documentTitle: 'Test Document Best',
      receivedAt: '2021-03-04T12:00:00.000Z',
    },
    {
      associatedJudge: 'Judge Foley',
      docketNumber: '456-67',
      docketNumberWithSuffix: '456-67',
      documentTitle: 'Test Document Best',
      receivedAt: '2020-03-04T12:00:00.000Z',
    },
    {
      associatedJudge: 'Judge Colvin',
      caseCaption: 'Test Caption, Petitioner',
      docketNumber: '123-45',
      docketNumberWithSuffix: '123-45',
      documentTitle: 'Test Document Title',
      receivedAt: '1990-01-01T12:00:00.000Z',
    },
    {
      associatedJudge: 'Judge Judgeson',
      caseCaption: 'Test Caption, Petitioner',
      docketNumber: '123-49',
      docketNumberWithSuffix: '123-49',
      documentTitle: 'Test Document Title',
      receivedAt: '1999-01-01T12:00:00.000Z',
    },
    {
      associatedJudge: 'Judge Buch',
      caseCaption: 'Test Caption Two, Petitioner(s)',
      docketNumber: '234-56',
      docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
      docketNumberWithSuffix: '234-56S',
      documentType: 'Test Document Type',
      receivedAt: '2020-02-02T12:00:00.000Z',
    },
    {
      associatedJudge: 'Judge Alvin',
      docketNumber: '345-67',
      docketNumberWithSuffix: '345-67',
      documentTitle: 'Test Document Title',
      leadDocketNumber: '456-78',
      receivedAt: '2020-03-03T12:00:00.000Z',
    },
    {
      associatedJudge: 'Judge Buch',
      docketNumber: '456-78',
      docketNumberWithSuffix: '456-78',
      documentTitle: 'Fear and Trembling',
      leadDocketNumber: '456-78',
      receivedAt: '2020-03-03T12:00:00.000Z',
    },
  ];

  beforeAll(() => {
    applicationContext.getStorageClient.mockReturnValue({
      upload: jest.fn((params, callback) => callback()),
    });

    applicationContext
      .getPersistenceGateway()
      .fetchPendingItems.mockResolvedValue({
        foundDocuments: mockFoundDocuments,
      });

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
      } as any),
    ).rejects.toThrow('Unauthorized');
  });

  it('should call fetchPendingItems from persistence and return the results', async () => {
    const results = await generatePrintablePendingReportInteractor(
      applicationContext,
      {} as any,
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
    await generatePrintablePendingReportInteractor(
      applicationContext,
      {} as any,
    );

    const { pendingItems } =
      applicationContext.getDocumentGenerators().pendingReport.mock.calls[0][0]
        .data;

    expect(pendingItems).toMatchObject([
      {
        associatedJudgeFormatted: 'Judgey',
        caseTitle: '',
        docketNumber: '456-68',
        docketNumberWithSuffix: '456-68',
        formattedFiledDate: '02/04/22',
        formattedName: 'Test Document Best',
        inConsolidatedGroup: false,
        isLeadCase: false,
      },
      {
        associatedJudgeFormatted: 'Judger',
        caseTitle: '',
        docketNumber: '456-69',
        docketNumberWithSuffix: '456-69',
        formattedFiledDate: '03/04/21',
        formattedName: 'Test Document Best',
        inConsolidatedGroup: false,
        isLeadCase: false,
      },
      {
        associatedJudgeFormatted: 'Foley',
        caseTitle: '',
        docketNumber: '456-67',
        docketNumberWithSuffix: '456-67',
        formattedFiledDate: '03/04/20',
        formattedName: 'Test Document Best',
        inConsolidatedGroup: false,
        isLeadCase: false,
      },
      {
        associatedJudgeFormatted: 'Colvin',
        caseTitle: 'Test Caption',
        docketNumber: '123-45',
        docketNumberWithSuffix: '123-45',
        formattedFiledDate: '01/01/90',
        formattedName: 'Test Document Title',
        inConsolidatedGroup: false,
        isLeadCase: false,
      },
      {
        associatedJudgeFormatted: 'Judgeson',
        caseTitle: 'Test Caption',
        docketNumber: '123-49',
        docketNumberWithSuffix: '123-49',
        formattedFiledDate: '01/01/99',
        formattedName: 'Test Document Title',
        inConsolidatedGroup: false,
        isLeadCase: false,
      },
      {
        associatedJudgeFormatted: 'Buch',
        caseTitle: 'Test Caption Two',
        docketNumber: '234-56',
        docketNumberWithSuffix: '234-56S',
        formattedFiledDate: '02/02/20',
        formattedName: 'Test Document Type',
        inConsolidatedGroup: false,
        isLeadCase: false,
      },
      {
        associatedJudgeFormatted: 'Alvin',
        caseTitle: '',
        docketNumber: '345-67',
        docketNumberWithSuffix: '345-67',
        formattedFiledDate: '03/03/20',
        formattedName: 'Test Document Title',
        inConsolidatedGroup: true,
      },
      {
        docketNumber: '456-78',
        inConsolidatedGroup: true,
        isLeadCase: true,
      },
    ]);
  });

  it('should generate a subtitle with All Judges if no judge filter is applied', async () => {
    await generatePrintablePendingReportInteractor(
      applicationContext,
      {} as any,
    );

    const { subtitle } =
      applicationContext.getDocumentGenerators().pendingReport.mock.calls[0][0]
        .data;
    expect(subtitle).toEqual('All Judges');
  });

  it('should generate a subtitle with the judge name if a judge filter is applied', async () => {
    await generatePrintablePendingReportInteractor(applicationContext, {
      judge: 'Colvin',
    } as any);

    const { subtitle } =
      applicationContext.getDocumentGenerators().pendingReport.mock.calls[0][0]
        .data;
    expect(subtitle).toEqual('Judge Colvin');
  });

  it('should get case information from persistence and generate a subtitle with the docket number if a docketNumber is present', async () => {
    await generatePrintablePendingReportInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    } as any);

    const { subtitle } =
      applicationContext.getDocumentGenerators().pendingReport.mock.calls[0][0]
        .data;

    expect(subtitle).toEqual(`Docket ${MOCK_CASE.docketNumber}`);
  });

  it('should generate a subtitle with the docket number suffix if present', async () => {
    MOCK_CASE.docketNumberWithSuffix = `${MOCK_CASE.docketNumber}${DOCKET_NUMBER_SUFFIXES.WHISTLEBLOWER}`;

    await generatePrintablePendingReportInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    } as any);

    const { subtitle } =
      applicationContext.getDocumentGenerators().pendingReport.mock.calls[0][0]
        .data;
    expect(subtitle).toEqual(`Docket ${MOCK_CASE.docketNumber}W`);
  });

  it('calls the document generator function', async () => {
    await generatePrintablePendingReportInteractor(
      applicationContext,
      {} as any,
    );

    expect(
      applicationContext.getDocumentGenerators().pendingReport,
    ).toHaveBeenCalled();
  });

  it('uploads the pdf to s3', async () => {
    await generatePrintablePendingReportInteractor(
      applicationContext,
      {} as any,
    );

    expect(applicationContext.getStorageClient).toHaveBeenCalled();
    expect(applicationContext.getStorageClient().upload).toHaveBeenCalled();
  });

  it('should return the document url', async () => {
    const results = await generatePrintablePendingReportInteractor(
      applicationContext,
      {} as any,
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
      generatePrintablePendingReportInteractor(applicationContext, {} as any),
    ).rejects.toEqual('error');
    expect(applicationContext.logger.error).toHaveBeenCalled();
    expect(applicationContext.logger.error.mock.calls[0][0]).toEqual(
      'error uploading to s3',
    );
  });
});
